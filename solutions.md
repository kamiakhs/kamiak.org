---
nav_exclude: true
---

# Sample Solutions
Sample solutions for [these problems](/problems) below.

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
        int res = 1;
        while (n > 1) {
            res *= n;
            n--;
        }
        return res;
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
 7. ```java
    int fibonacci(int n) {
        int a = 0, b = 1;
        while (n > 0) {
            b = b+a;
            a = b-a;
            n--;
        }
        return a;
    }
    ```
 8. ```java
    int binarySearch(int[] arr, int target) {
        int l = 0, r = arr.length-1;
        while (l <= r) {
            int m = (l+r)/2;
            if (target < arr[m]) {
                r = m-1;
            } else if (arr[m] < target) {
                l = m+1;
            } else {
                return m;
            }
        }
        return -1;
    }
    ```
 9. ```java
    void countingSort(int[] arr) {
        int[] count = {0, 0, 0};
        for (int num: arr) count[num]++;
        int i = 0;
        for (int color = 0; color <= 2; ++color) {
            while (count[color] > 0) {
                arr[i] = color;
                count[color]--;
                i++;
            }
        }
    }
    ```
 10. ```java
     int mostFrequent(int[] arr) {
         Map<Integer, Integer> counts = new HashMap<Integer, Integer>();
         for (int num: arr) {
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
     
## Intermediate
 1. ```java
    int minCostClimbingStairs(int[] cost) {
        for (int i = 2; i < cost.length; i++) {
            cost[i] += Math.min(cost[i-1], cost[i-2]);
        }
        return Math.min(cost[cost.length-1], cost[cost.length-2]); 
    }
    ```
 2. ```java
    String longestCommonPrefix(String[] strings) {
        int n = Integer.MAX_VALUE;
        for (String string: strings) {
            if (string.length() < n) {
                n = string.length();
            }
        }
        for (int c = 0; c < n; c++) {
            for (int i = 1; i < strings.length; i++) {
                if (strings[i].charAt(c) != strings[i-1].charAt(c)) {
                    return strings[0].substring(0, c);
                }
            }
        }
        return strings[0].substring(0, n);
        
    }
    ```
 3. ```java
    int[] twoSum(int[] arr, int target) {
        Map<Integer, Integer> hash = new HashMap<Integer, Integer>();  // this will store values and index in arr
        for (int i = 0; i < arr.length; i++) {
            int addend = target-arr[i];  // number that when added to arr[i] equals target
            if (hash.containsKey(addend)) {
                return new int[]{i, hash.get(addend)};
            }
            hash.put(arr[i], i);
        }
        return new int[]{-1, -1};
    }
    ```

## Advanced
 10. ```java
     int largestRectangleArea(int[] arr) {
         int res = arr[0];
         Stack<Integer> s = new Stack<Integer>();
         s.push(0);
         for (int i = 1; i < arr.length; i++) {
             while (!s.empty() && arr[i] <= arr[s.peek()]) {
                 int h = arr[s.peek()];
                 s.pop();
                 int a;
                 if (!s.empty()) {
                     a = h*((i-1)-s.peek());
                 } else {
                     a = h*i;
                 }
                 if (a > res) res = a;
             }
             s.push(i);
         }
         // repeat an extra time to clear remaining stack
         while (!s.empty()) {
             int h = arr[s.peek()];
             s.pop();
             int a;
             if (!s.empty()) {
                 a = h*((arr.length-1)-s.peek());
             } else {
                 a = h*arr.length;
             }
             if (a > res) res = a;
         }
         return res;
     }
     ```
