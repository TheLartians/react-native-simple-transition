/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WithPushTransition} from 'react-native-simple-transition';

const App = () => {
  const [count, setCount] = useState(0);
  const direction = (['up', 'down', 'left', 'right'] as const)[count % 4];

  return (
    <SafeAreaView style={styles.appContainer}>
      <WithPushTransition
        style={styles.innerWindow}
        duration={500}
        direction={direction}>
        <View
          key={count}
          style={[
            styles.innerContainer,
            {backgroundColor: count % 2 == 0 ? 'red' : 'green'},
          ]}>
          <Text style={styles.innerLabel}>{direction}</Text>
        </View>
      </WithPushTransition>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonLabel}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  buttonContainer: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 100,
    justifyContent: 'center',
    marginTop: 0,
    margin: 10,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  innerWindow: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    margin: 10,
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerLabel: {color: 'white', fontSize: 20, fontWeight: 'bold'},
});

export default App;
