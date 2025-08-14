#!/usr/bin/env python3
"""
Validate CV Quest card deck for dead ends and missing connections
"""

import json
import re
from collections import defaultdict

def load_deck_data():
    """Load the generated cv-cards.json"""
    with open('creative/quest/data/cv-cards.json', 'r') as f:
        return json.load(f)

def extract_function_calls(func_str):
    """Extract function calls from string"""
    if not func_str:
        return []
    
    calls = []
    # Match function calls like switchDeckFn("deckname") or showMiniGameFn("gamename")
    patterns = [
        r'switchDeckFn\("([^"]+)"\)',
        r'switchDeckFn\(\'([^\']+)\'\)',
        r'showMiniGameFn\("([^"]+)"\)',
        r'showMiniGameFn\(\'([^\']+)\'\)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, func_str)
        for match in matches:
            if 'switchDeckFn' in pattern:
                calls.append(('deck', match))
            elif 'showMiniGameFn' in pattern:
                calls.append(('minigame', match))
    
    # Check for nextCard() calls
    if 'nextCard()' in func_str:
        calls.append(('next', None))
    
    return calls

def validate_deck(data):
    """Validate deck structure and find issues"""
    issues = []
    deck_stats = {}
    
    # Get all decks and mini-games
    all_decks = set(data['cardDecks'].keys())
    all_minigames = set(data['miniGames'].keys())
    
    print("\n=== DECK VALIDATION REPORT ===\n")
    print(f"Found {len(all_decks)} decks: {', '.join(sorted(all_decks))}")
    print(f"Found {len(all_minigames)} mini-games: {', '.join(sorted(all_minigames))}")
    print(f"Found {len(data.get('personalCards', []))} personal cards")
    
    # Check each deck
    print("\n=== DECK ANALYSIS ===\n")
    for deck_name, cards in data['cardDecks'].items():
        print(f"\n📦 Deck: {deck_name}")
        print(f"  Cards: {len(cards)}")
        deck_stats[deck_name] = len(cards)
        
        for i, card in enumerate(cards):
            print(f"\n  Card {i}: {card.get('title', 'Untitled')}")
            
            # Check left choice
            left_result = card.get('leftResult', '')
            if left_result:
                print(f"    Left: '{card.get('leftChoice', 'No label')}' ->")
                calls = extract_function_calls(left_result)
                if calls:
                    for call_type, target in calls:
                        if call_type == 'deck':
                            if target not in all_decks:
                                issues.append(f"Deck '{deck_name}' Card {i} left -> Missing deck: {target}")
                                print(f"      ❌ Missing deck: {target}")
                            else:
                                print(f"      ✓ Switch to deck: {target}")
                        elif call_type == 'minigame':
                            if target not in all_minigames:
                                issues.append(f"Deck '{deck_name}' Card {i} left -> Missing mini-game: {target}")
                                print(f"      ❌ Missing mini-game: {target}")
                            else:
                                print(f"      ✓ Show mini-game: {target}")
                        elif call_type == 'next':
                            if i >= len(cards) - 1:
                                issues.append(f"Deck '{deck_name}' Card {i} left -> nextCard() at deck end")
                                print(f"      ⚠️ nextCard() but this is the last card")
                            else:
                                print(f"      ✓ Next card")
                else:
                    print(f"      Actions: {left_result[:50]}...")
            else:
                print(f"    Left: No action defined")
            
            # Check right choice
            right_result = card.get('rightResult', '')
            if right_result:
                print(f"    Right: '{card.get('rightChoice', 'No label')}' ->")
                calls = extract_function_calls(right_result)
                if calls:
                    for call_type, target in calls:
                        if call_type == 'deck':
                            if target not in all_decks:
                                issues.append(f"Deck '{deck_name}' Card {i} right -> Missing deck: {target}")
                                print(f"      ❌ Missing deck: {target}")
                            else:
                                print(f"      ✓ Switch to deck: {target}")
                        elif call_type == 'minigame':
                            if target not in all_minigames:
                                issues.append(f"Deck '{deck_name}' Card {i} right -> Missing mini-game: {target}")
                                print(f"      ❌ Missing mini-game: {target}")
                            else:
                                print(f"      ✓ Show mini-game: {target}")
                        elif call_type == 'next':
                            if i >= len(cards) - 1:
                                issues.append(f"Deck '{deck_name}' Card {i} right -> nextCard() at deck end")
                                print(f"      ⚠️ nextCard() but this is the last card")
                            else:
                                print(f"      ✓ Next card")
                else:
                    print(f"      Actions: {right_result[:50]}...")
            else:
                print(f"    Right: No action defined")
    
    # Check for empty decks
    print("\n=== DECK SIZE ANALYSIS ===\n")
    for deck_name, count in deck_stats.items():
        if count == 0:
            issues.append(f"Deck '{deck_name}' is empty")
            print(f"❌ {deck_name}: EMPTY")
        elif count == 1:
            print(f"⚠️ {deck_name}: Only 1 card")
        else:
            print(f"✓ {deck_name}: {count} cards")
    
    # Check mini-games
    print("\n=== MINI-GAME VALIDATION ===\n")
    for game_name, game_data in data['miniGames'].items():
        print(f"🎮 {game_name}: {game_data.get('title', 'Untitled')}")
        buttons = game_data.get('buttons', [])
        if not buttons:
            issues.append(f"Mini-game '{game_name}' has no buttons")
            print(f"  ❌ No buttons defined")
        else:
            print(f"  ✓ {len(buttons)} buttons")
            for btn in buttons:
                print(f"    - {btn.get('text', 'No text')}")
    
    # Find unreachable decks
    print("\n=== REACHABILITY ANALYSIS ===\n")
    reachable = set(['main'])  # Start from main deck
    to_check = ['main']
    
    while to_check:
        current = to_check.pop()
        if current in data['cardDecks']:
            for card in data['cardDecks'][current]:
                for result in [card.get('leftResult', ''), card.get('rightResult', '')]:
                    calls = extract_function_calls(result)
                    for call_type, target in calls:
                        if call_type == 'deck' and target not in reachable:
                            reachable.add(target)
                            to_check.append(target)
    
    unreachable = all_decks - reachable
    if unreachable:
        print(f"❌ Unreachable decks: {', '.join(sorted(unreachable))}")
        for deck in unreachable:
            issues.append(f"Deck '{deck}' is unreachable from main")
    else:
        print("✓ All decks are reachable from main")
    
    # Summary
    print("\n=== SUMMARY ===\n")
    if issues:
        print(f"❌ Found {len(issues)} issues:\n")
        for issue in issues:
            print(f"  • {issue}")
    else:
        print("✅ No issues found! All paths are valid.")
    
    return issues

def suggest_fixes(data, issues):
    """Suggest fixes for found issues"""
    print("\n=== SUGGESTED FIXES ===\n")
    
    # Check for the specific dead end mentioned
    personal_deck = data['cardDecks'].get('personal', [])
    if personal_deck:
        print("📍 Personal deck analysis:")
        for i, card in enumerate(personal_deck):
            print(f"  Card {i}: {card.get('title')}")
            right_result = card.get('rightResult', '')
            if 'showMiniGameFn("personalValues")' in right_result:
                print(f"    → Shows personalValues mini-game")
                # Check if mini-game exists
                if 'personalValues' not in data['miniGames']:
                    print(f"    ❌ Mini-game 'personalValues' missing!")
                else:
                    print(f"    ✓ Mini-game exists")
    
    print("\nSuggested fixes:")
    print("1. Add navigation buttons to mini-games to return to decks")
    print("2. Ensure all decks have at least 2-3 cards")
    print("3. Add 'Return to Main' option on last cards")
    print("4. Consider adding more content to single-card decks")

def main():
    """Main validation function"""
    try:
        data = load_deck_data()
        issues = validate_deck(data)
        suggest_fixes(data, issues)
        
        # Return exit code based on validation
        return 0 if not issues else 1
        
    except FileNotFoundError:
        print("❌ Error: cv-cards.json not found. Run 'make quest' first.")
        return 1
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())