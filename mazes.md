# Advanced Topics mazes pseudocode

## Maze path algorithms

### Longest path
```java
ICell cellA = getFurthestCell(maze[0][0]), cellB = getFurthestCell(cellA);
```

## Maze generation algorithms

### Basic info
- If current cell isn't defined, it means the cell at the current row and column
- Some code conciseness was sacrificed for simplicity's sake
- Not included yet:
  - DFS by stack (recursion doesn't work for large mazes due to a maximum recursion depth),
  - Prim's algorithm
- Useful maze picture (sidewinder and binary tree are rotated 180 degrees)\
  ![Six mazes](https://kamiakhs.github.io/kamiak.org/mazes.png)

### Binary tree
```
for each row (except last) and each column (except last)
	link current cell with either east cell or south cell
endfor
link all cells in last column
link all cells in last row
```

### Sidewinder
```
for each row (except last)
	// randomly group cells by choosing whether or not to enable all walls of the row (except first and last wall)
	// extend downward from a random cell of each of these groups
	create group of cells
	add first cell of row to group
	for each col in row (except first)
		if we are extending group
			link current cell to previous cell in the row
			add current cell to group
		if we are ending group  // ending the group before current cell
			link southward from random cell of group
			clear group
			add current cell to group
		endif
	endfor
	// VV since there is still the last group
	link southward from random cell of group
endfor
link all cells in last row
```

### Aldous-Broder
```
set current cell to random cell
visit current cell  // we will link to unvisited cells, but there is no cell
                    // to link to the starting cell
set number of cells left to number of cells in grid minus one for the starting cell
while there are cells left
	set adjacent cell to random non-null cell from current cell's adjacent cells
	if adjacent cell is unvisited
		visit adjacent cell
		decrement number of cells left
		link cell to adjacent cell
	set cell to adjacent cell
endwhile
```

### DFS by recursion
```
// start on 0,0 (or random cell; I used 0,0)
call dfs with cell at 0,0
function dfs given cell
	set adjacent cells to list *copy* of current cell's adjacent cells
	// WARNING:                  ^^ arrays.aslist returns a view, not a copy
	//                              this was a pain to debug
	shuffle adjacent cells
	for each adjacent cell
		if adjacent cell is non-null and unvisited
			link cell to adjacent cell
			call dfs with adjacent cell  // this is the depth-first part
		endif
	endfor
endfunction
```
