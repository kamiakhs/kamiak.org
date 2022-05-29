# Sample Problems
I tried to cover as much as I could, but I skipped Binary Tree in intermediate because I thought the other algorithms were more important. These are interview problems, so they should be quite challenging.

## Beginner
 1. Index of Character in String Without indexOf (Linear Search)
 2. Sum of 2D Array (Basic Traversal of 2D Array)
 3. N Factorial (Basic Index Manipulation)
 4. FizzBuzz [[412]](https://leetcode.com/problems/fizz-buzz/) (Stacked If-Statements)
 5. Index of Substring in String Without indexOf [[28]](https://leetcode.com/problems/implement-strstr/) (Linear Search, Index Manipulation)
 6. Two Numbers in Array That Add to Target [[1]](https://leetcode.com/problems/two-sum/) (Special Traversal of 2D Array)
 7. Most Occuring Number in Array, aka Mode (Map)
 8. Nth Term of Fibonacci Sequence [[509]](https://leetcode.com/problems/fibonacci-number/) (Recursion/Repitition)
 9. Binary Search [[704]](https://leetcode.com/problems/binary-search/) (Basic Sorted Array Manipulation)
 10. Sort Array of 0s, 1s, and 2s [[75]](https://leetcode.com/problems/sort-colors/) (Simple Counting Sort)

## Intermediate
 1. Climbing Stairs [[70]](https://leetcode.com/problems/climbing-stairs/) (Pattern Recognition, Dynamic Programming)
 2. Longest Common Prefix of String Array [[14]](https://leetcode.com/problems/longest-common-prefix/) (Traversal of Jagged Array)
 3. Two Numbers in Array That Add to Target in O(n) [[1]](https://leetcode.com/problems/two-sum/) (HashMap/HashSet)
 4. Remove All Occurences of Element From List [[27]](https://leetcode.com/problems/remove-element/) (LinkedList)
 5. Rotate 2D Array [[48]](https://leetcode.com/problems/rotate-image/) (2D Array Index Manipulation)
 6. Sort Numbers From -50,000 to 50,000 [[912]](https://leetcode.com/problems/sort-an-array/) (MergeSort/RadixSort)
 7. Valid Parentheses [[20]](https://leetcode.com/problems/valid-parentheses/) (Stack)
 8. Letter Combinations of a Phone Number [[17]](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) (Combinations)
 9. Container With Most Water [[11]](https://leetcode.com/problems/container-with-most-water/) (Two Pointer, Greedy)
 10. Minimum Path Sum [[64]](https://leetcode.com/problems/minimum-path-sum/) (Dynamic Programming)

## Advanced
 1. Find First and Last Position of Element in O(log n) [[34]](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) (Two Pointer, Binary Search)
 2. Merge Intervals [[56]](https://leetcode.com/problems/merge-intervals/) (Array)
 3. Merge k Sorted Lists [[23]](https://leetcode.com/problems/merge-k-sorted-lists) (LinkedList)
 4. Reverse Nodes in k-Group [[25]](https://leetcode.com/problems/reverse-nodes-in-k-group/) (LinkedList)
 5. Combination Sum [[39]](https://leetcode.com/problems/combination-sum/) (Combinations)
 6. First Missing Positive in O(n) Time and O(k) Extra Memory [[41]](https://leetcode.com/problems/first-missing-positive/) (Memory Manipulation)
 7. Maximum Path Sum [[124]](https://leetcode.com/problems/binary-tree-maximum-path-sum/) (Binary Tree, Dynamic Programming)
 8. Longest Valid Parentheses [[32]](https://leetcode.com/problems/longest-valid-parentheses/) (Stack)
 9. Trapping Rain Water [[42]](https://leetcode.com/problems/trapping-rain-water/) (Two Pointer)
 10. Largest Rectangle in Histogram [[84]](https://leetcode.com/problems/largest-rectangle-in-histogram/) (Stack)

# Solutions
## Beginner
 1. ```java
    int findCharacter(String string, char ch) {
        for (int i = 0; i < string.length(); i++) {
            if (string.charAt(i) == ch) {
                return i;
            }
        }
        return -1;
    }
    ```
 2. ```java
    int sumArray(int[][] arr) {
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr[i].length; j++) {
                sum += arr[i][j];
            }
        }
        return sum;
    }
    ```
 3. ```java
    int factorial(int n) {
        int prod = 1;
        while (n > 1) {
            prod *= n;
            n--;
        }
        return prod;
    }
    ```
 4. ```java
    List<String> fizzBuzz(int n) {
        List<String> res = new ArrayList<String>();
        for (int i = 1; i <= n; i++) {
            if (i%3 == 0 && i%5 == 0) {
                res.add("FizzBuzz");
            } else if (i%3 == 0) {
                res.add("Fizz");
            } else if (i%5 == 0) {
                res.add("Buzz");
            } else {
                res.add(""+i);
            }
        }
        return res;
    }
    ```
 5. ```java
    int findSubstring(String string, String sub) {
        for (int i = 0; i < string.length()-sub.length()+1; i++) {
            if (string.substring(i, i+sub.length()).equals(sub)) {
                return i;
            }
        }
        return -1;
    }
    ```
 6. ```java
    int[] twoSum(int[] arr, int target) {
        for (int i = 0; i < arr.length-1; i++) {
            for (int j = i+1; j < arr.length; j++) {
                if (arr[i]+arr[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{-1, -1};
    }
    ```
 8. ```java
    int mostFrequent(int[] arr) {
        Map<Integer, Integer> counts = new HashMap<Integer, Integer>();
        for (int i = 0; i < arr.length; i++) {
            int num = arr[i];
            if (counts.containsKey(num)) {
                counts.put(num, counts.get(num)+1);
            } else {
                counts.put(num, 1);
            }
        }
        int maxNum = arr[0], maxCount = 1;
        for (Integer num: counts.keySet()) {
            int count = counts.get(num);
            if (count > maxCount) {
                maxNum = num;
                maxCount = count;
            }
        }
        return maxNum;
    }
```
