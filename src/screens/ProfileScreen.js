import { Box, Button, Text, VStack, View } from 'native-base';

// src/screens/ProfileScreen.js
import React from 'react';

function ProfileScreen() {
  return (
    <VStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      space={4}
      p={4}
    >
      <Text fontSize="2xl" fontWeight="bold">
        User Profile
      </Text>

      <Box p={5} rounded="md" shadow={3} bg="light.300">
        <Text fontSize="lg">Name</Text>
        <Text fontSize="xl" fontWeight="bold">
          John Doe
        </Text>
      </Box>

      <Box p={5} rounded="md" shadow={3} bg="light.300">
        <Text fontSize="lg">Email</Text>
        <Text fontSize="xl" fontWeight="bold">
          johndoe@example.com
        </Text>
      </Box>

      <Button mt={5} colorScheme="danger">
        Log Out
      </Button>
    </VStack>
  );
}

export default ProfileScreen;
