#!/usr/bin/env python3
"""
CSV to JSON converter for measures data
Reads jenny.csv and converts each line to a measure object in ridge.json format
"""

import csv
import json
import sys
from typing import Dict, List, Any

def parse_state(state_str: str) -> str:
    """Convert state string to standardized format matching ridge.json"""
    if not state_str or state_str.strip() == '':
        return "NOT_STARTED"
    
    state_lower = state_str.lower().strip()
    
    if 'y' in state_lower and 'in progress' not in state_lower:
        return "IMPLEMENTED"
    elif 'n' in state_lower and 'in progress' in state_lower:
        return "IN_PROGRESS"
    elif 'n' in state_lower and 'not applicable' in state_lower:
        return "NOT_APPLICABLE"
    elif 'n' in state_lower and 'not started' in state_lower:
        return "NOT_STARTED"
    elif 'n' in state_lower:
        return "NOT_STARTED"
    else:
        return "NOT_STARTED"

def parse_task_state(state_str: str) -> str:
    """Convert task state string to standardized format matching ridge.json"""
    if not state_str or state_str.strip() == '':
        return "TODO"
    
    state_lower = state_str.lower().strip()
    
    if 'y' in state_lower and 'in progress' not in state_lower:
        return "DONE"
    elif 'n' in state_lower and 'in progress' in state_lower:
        return "TODO"
    elif 'n' in state_lower:
        return "TODO"
    else:
        return "TODO"

def clean_text(text: str) -> str:
    """Clean and normalize text"""
    if not text:
        return ""
    return text.strip().replace('\n', ' ').replace('\r', '')

def get_category_from_control(control: str) -> str:
    """Determine category based on control reference"""
    if control.startswith('A.5'):
        return "ORGANIZATIONAL CONTROLS"
    elif control.startswith('A.6'):
        return "PEOPLE CONTROLS"
    elif control.startswith('A.7'):
        return "PHYSICAL CONTROLS"
    elif control.startswith('A.8'):
        return "TECHNICAL CONTROLS"
    else:
        return "ORGANIZATIONAL CONTROLS"

def is_category_row(control: str, title: str) -> bool:
    """Check if this is a category row (like 'A.5,ORGANIZATIONAL CONTROLS')"""
    # Category rows have control numbers without decimal points (A.5, A.6, A.7, A.8)
    # and titles that are category names
    if not control or not title:
        return False
    
    # Check if control is a category number (A.5, A.6, A.7, A.8)
    category_controls = ['A.5', 'A.6', 'A.7', 'A.8']
    if control in category_controls:
        # Check if title is a category name
        category_titles = [
            'ORGANIZATIONAL CONTROLS',
            'PEOPLE CONTROLS', 
            'PHYSICAL CONTROLS',
            'TECHNICAL CONTROLS'
        ]
        if title.upper() in category_titles:
            return True
    
    return False

def csv_to_json(csv_file: str) -> List[Dict[str, Any]]:
    """Convert CSV file to JSON format matching ridge.json"""
    measures = []
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        
        # Skip header row
        next(reader)
        
        current_control = ""
        current_title = ""
        current_description = ""
        current_applicable = ""
        current_justification = ""
        current_implemented = ""
        current_implementation_details = ""
        
        for row in reader:
            if len(row) < 6:
                continue
                
            control = clean_text(row[0])
            title_description = clean_text(row[1])
            applicable = clean_text(row[2])
            justification = clean_text(row[3])
            implemented = clean_text(row[4])
            implementation_details = clean_text(row[5])
            
            # Skip category rows (like "A.5,ORGANIZATIONAL CONTROLS")
            if is_category_row(control, title_description):
                continue
            
            # If this is a description row (no control but has description)
            if not control and title_description:
                current_description = title_description
                continue
            
            # If this is a control row (has control and title)
            if control and title_description:
                # Save previous measure if we have one
                if current_control and current_title:
                    category = get_category_from_control(current_control)
                    
                    # Format name like ridge.json: "A.5.1 Policies for information security"
                    measure_name = f"{current_control} {current_title}"
                    
                    measure = {
                        "name": measure_name,
                        "description": current_description if current_description else current_title,
                        "category": category,
                        "reference-id": f"ISO/IEC 27001:2022-{current_control}",
                        "state": parse_state(current_implemented),
                        "standards": [
                            {
                                "framework": "ISO 27001 (2022)",  # Match ridge.json format
                                "control": current_control
                            }
                        ],
                        "tasks": []
                    }
                    
                    # Add task if implementation details exist
                    if current_implementation_details:
                        task = {
                            "name": f"ISO/IEC 27001:2022-{current_control}-001",
                            "description": f"\n{current_implementation_details}",  # Add newline like ridge.json
                            "reference-id": f"ISO/IEC 27001:2022-{current_control}-001",
                            "state": parse_task_state(current_implemented)
                        }
                        measure["tasks"].append(task)
                    
                    measures.append(measure)
                
                # Start new measure
                current_control = control
                current_title = title_description
                current_description = ""
                current_applicable = applicable
                current_justification = justification
                current_implemented = implemented
                current_implementation_details = implementation_details
        
        # Don't forget the last measure
        if current_control and current_title:
            category = get_category_from_control(current_control)
            
            # Format name like ridge.json: "A.5.1 Policies for information security"
            measure_name = f"{current_control} {current_title}"
            
            measure = {
                "name": measure_name,
                "description": current_description if current_description else current_title,
                "category": category,
                "reference-id": f"ISO/IEC 27001:2022-{current_control}",
                "state": parse_state(current_implemented),
                "standards": [
                    {
                        "framework": "ISO 27001 (2022)",  # Match ridge.json format
                        "control": current_control
                    }
                ],
                "tasks": []
            }
            
            # Add task if implementation details exist
            if current_implementation_details:
                task = {
                    "name": f"ISO/IEC 27001:2022-{current_control}-001",
                    "description": f"\n{current_implementation_details}",  # Add newline like ridge.json
                    "reference-id": f"ISO/IEC 27001:2022-{current_control}-001",
                    "state": parse_task_state(current_implemented)
                }
                measure["tasks"].append(task)
            
            measures.append(measure)
    
    return measures

def main():
    """Main function"""
    input_file = "jenny.csv"
    output_file = "jenny_measures.json"
    
    try:
        print(f"Reading {input_file}...")
        measures = csv_to_json(input_file)
        
        print(f"Converting {len(measures)} measures...")
        
        # Write to JSON file with same formatting as ridge.json
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(measures, f, indent=4, ensure_ascii=False)
        
        print(f"Successfully converted {len(measures)} measures to {output_file}")
        
        # Print summary
        categories = {}
        states = {}
        for measure in measures:
            cat = measure['category']
            state = measure['state']
            categories[cat] = categories.get(cat, 0) + 1
            states[state] = states.get(state, 0) + 1
        
        print("\nSummary:")
        print("Categories:")
        for cat, count in categories.items():
            print(f"  {cat}: {count} measures")
        
        print("\nStates:")
        for state, count in states.items():
            print(f"  {state}: {count} measures")
            
    except FileNotFoundError:
        print(f"Error: {input_file} not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 