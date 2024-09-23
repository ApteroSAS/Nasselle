#!/bin/bash

#chmod +x disk_test.sh
#./disk_test.sh /path/to/test

# Check if a path is provided
if [ -z "$1" ]; then
  echo "Usage: $0 /path/to/test"
  exit 1
fi

# Variables
TEST_PATH=$1
SIZE="1G"
BLOCK_SIZE="4k"
RUNTIME="60"

echo "Running disk performance tests on $TEST_PATH"

# Sequential Write Test
echo "Starting Sequential Write Test..."
fio --name=seq_write_test --filename=${TEST_PATH}/fio_testfile --size=${SIZE} --bs=${BLOCK_SIZE} --rw=write --direct=1 --numjobs=1 --time_based --runtime=${RUNTIME}
echo "Sequential Write Test Completed."

# Sequential Read Test
echo "Starting Sequential Read Test..."
fio --name=seq_read_test --filename=${TEST_PATH}/fio_testfile --size=${SIZE} --bs=${BLOCK_SIZE} --rw=read --direct=1 --numjobs=1 --time_based --runtime=${RUNTIME}
echo "Sequential Read Test Completed."

# Random Write Test
echo "Starting Random Write Test..."
fio --name=rand_write_test --filename=${TEST_PATH}/fio_testfile --size=${SIZE} --bs=${BLOCK_SIZE} --rw=randwrite --direct=1 --numjobs=1 --time_based --runtime=${RUNTIME}
echo "Random Write Test Completed."

# Random Read Test
echo "Starting Random Read Test..."
fio --name=rand_read_test --filename=${TEST_PATH}/fio_testfile --size=${SIZE} --bs=${BLOCK_SIZE} --rw=randread --direct=1 --numjobs=1 --time_based --runtime=${RUNTIME}
echo "Random Read Test Completed."

# Clean up
echo "Cleaning up..."
rm -f ${TEST_PATH}/fio_testfile
echo "All tests completed and cleaned up."
