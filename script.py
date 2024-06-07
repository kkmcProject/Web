import sys
import json
from collections import defaultdict

def combine_fruits_with_index(rows):
    combined = defaultdict(lambda: {'hard': 0, 'indices': []})
    for row in rows:
        fruit = row['fruit']
        combined[fruit]['hard'] += row['hard']
        combined[fruit]['indices'].append(row['index'])

    combined_rows = [{'fruit': fruit, 'hard': data['hard'], 'indices': data['indices']} for fruit, data in combined.items()]
    return combined_rows

def split_highest_hard(combined_rows, original_rows):
    combined_rows.sort(key=lambda x: x['hard'], reverse=True)

    highest_hard = combined_rows[0]['hard']
    second_highest_hard = combined_rows[1]['hard'] if len(combined_rows) > 1 else 0
    highest_fruit = combined_rows[0]['fruit']

    new_rows = []
    remaining_hard = 0
    split_indices = []

    if highest_hard > second_highest_hard:
        for row in original_rows:
            if row['fruit'] == highest_fruit:
                remaining_hard += row['hard']
                split_indices.append(row['index'])
                if remaining_hard >= second_highest_hard:
                    split_hard = remaining_hard - row['hard']
                    if split_hard > 0:
                        new_rows.append({'fruit': highest_fruit, 'hard': split_hard, 'indices': split_indices[:-1]})
                    split_hard = row['hard']
                    new_rows.append({'fruit': highest_fruit, 'hard': split_hard, 'indices': [split_indices[-1]]})
                    remaining_hard = 0
                    split_indices = []

        if remaining_hard > 0:
            new_rows.append({'fruit': highest_fruit, 'hard': remaining_hard, 'indices': split_indices})

    remaining_combined_rows = combined_rows[1:]
    return remaining_combined_rows + new_rows


def heuristic_allocation(rows, group_info):
    print("Starting heuristic allocation")

    combined_rows = combine_fruits_with_index(rows)
    adjusted_rows = split_highest_hard(combined_rows, rows)

    group_names = [group['name'] for group in group_info]
    group_sizes = {group['name']: group['count'] for group in group_info}
    group_hard = {group['name']: 0 for group in group_info}
    group_fruit_counts = {group['name']: defaultdict(int) for group in group_info}

    adjusted_rows.sort(key=lambda x: x['hard'], reverse=True)

    allocation = defaultdict(list)

    for task in adjusted_rows:
        min_eta_group = min(group_names, key=lambda g: (group_hard[g] / group_sizes[g], group_fruit_counts[g][task['fruit']]))

        for index in task['indices']:
            allocation[min_eta_group].append(index)

        group_hard[min_eta_group] += task['hard']
        group_fruit_counts[min_eta_group][task['fruit']] += 1

    print("Initial allocation from heuristic:")
    for group in group_names:
        eta = group_hard[group] / group_sizes[group]
        fruits = {task['fruit'] for task in adjusted_rows if any(index in allocation[group] for index in task['indices'])}
        indices = [index for index in allocation[group]]
        print(f"Group {group} eta: {eta}, fruits: {fruits}, indices: {indices}")

    # 할당 결과를 원래 rows에 반영
    for task in rows:
        for group in group_names:
            if task['index'] in allocation[group]:
                task['group'] = group

    print("Allocation:")
    for task in rows:
        print({'index': task['index'], 'group': task.get('group', 'Not assigned')})

    return rows


def main():
    print(f"Received {len(sys.argv)-1} arguments.")
    if len(sys.argv) != 3:
        print("Usage: script.py <rows_json> <workGroup_json>")
        return
    
    rows_json = sys.argv[1]
    workGroup_json = sys.argv[2]

    print(f"workGroup_json path: {workGroup_json}")

    try:
        with open(rows_json, 'r', encoding='utf-8') as f:
            rows_data = f.read()
            if not rows_data:
                raise ValueError("Empty rows JSON file")
            rows = json.loads(rows_data)
        
        with open(workGroup_json, 'r', encoding='utf-8') as f:
            workGroup_data = f.read()
            if not workGroup_data:
                raise ValueError("Empty workGroup JSON file")
            workGroup = json.loads(workGroup_data)

        print("Received rows and workGroup JSON data from files.")
        result_rows = heuristic_allocation(rows, workGroup)
        
        with open(rows_json, 'w', encoding='utf-8') as f:
            json.dump(result_rows, f, ensure_ascii=False, indent=4)
            print(f"Result saved to {rows_json}")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
