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
import {WithPushTransition} from 'react-native-component-transition';

const App = () => {
  const [count, setCount] = useState(0);
  const direction = (['up', 'down', 'left', 'right'] as const)[count % 4];

  return (
    <SafeAreaView style={styles.appContainer}>
      <WithPushTransition
        style={styles.innerWindow}
        duration={500}
        contentKey={count}
        direction={direction}>
        <View
          style={[
            styles.innerContainer,
            {backgroundColor: count % 2 == 0 ? 'red' : 'green'},
          ]}>
          <Text style={styles.innerLabel}>{count.toString()}</Text>
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
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: 'blue',
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 100,
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  innerWindow: {
    width: '80%',
    height: '50%',
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
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
