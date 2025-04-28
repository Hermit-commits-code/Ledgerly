import { Box, FlatList, Text, VStack, View } from 'native-base';

// src/screens/BudgetScreen.js
import React from 'react';

function BudgetScreen() {
  const budgetCategories = [
    { id: '1', category: 'Groceries', budget: '$400.00' },
    { id: '2', category: 'Entertainment', budget: '$150.00' },
    { id: '3', category: 'Transport', budget: '$100.00' },
  ];

  return (
    <VStack flex={1} space={4} p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Budget Overview
      </Text>

      <FlatList
        data={budgetCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Box p={4} rounded="md" shadow={3} bg="light.200" mb={3}>
            <Text fontSize="lg">{item.category}</Text>
            <Text fontSize="xl" fontWeight="bold">
              {item.budget}
            </Text>
          </Box>
        )}
      />
    </VStack>
  );
}

export default BudgetScreen;
