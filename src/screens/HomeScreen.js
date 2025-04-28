import { Box, HStack, Text, VStack, View } from 'native-base';

// src/screens/HomeScreen.js
import React from 'react';

function HomeScreen() {
  return (
    <VStack
      flex={1}
      space={4}
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Text fontSize="2xl" fontWeight="bold">
        Welcome to Ledgerly!
      </Text>

      <Box p={5} rounded="md" shadow={3} bg="light.300">
        <Text fontSize="lg">Total Balance</Text>
        <Text fontSize="xl" fontWeight="bold">
          $12,345.67
        </Text>
      </Box>

      <HStack space={3} mt={5}>
        <Box p={4} rounded="md" bg="success.200">
          <Text color="white">Income</Text>
          <Text color="white" fontWeight="bold">
            $8,000.00
          </Text>
        </Box>
        <Box p={4} rounded="md" bg="danger.200">
          <Text color="white">Expenses</Text>
          <Text color="white" fontWeight="bold">
            $2,500.00
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
}

export default HomeScreen;
