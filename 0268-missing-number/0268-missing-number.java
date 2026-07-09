class Solution {
    public int missingNumber(int[] nums) {
         

         Arrays.sort(nums);

      // Step 2: Check if 0 is missing
        if (nums[0] != 0) {
            return 0;
        }

        // Step 3: Check for a gap in between
        for (int i = 0; i < nums.length - 1; i++) {

            if (nums[i + 1] - nums[i] > 1) {
                return nums[i] + 1;
            }

        }

        // Step 4: If no gap found, missing number is at the end
        return nums[nums.length - 1] + 1;
    
    }
}