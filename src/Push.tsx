import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Animated, View, Easing, ViewStyle } from "react-native";

type Key = string | number | null | undefined;

type AnimatedMoveInProps = {
  children: React.ReactNode & { key?: Key };
  contentKey?: Key;
  duration?: number;
  style?: ViewStyle;
  easing?: (v: number) => number;
  direction?: "left" | "right" | "up" | "down";
};

function createTransform(
  value: Animated.Value,
  idx: number,
  width: number,
  height: number,
  direction: AnimatedMoveInProps["direction"]
) {
  switch (direction) {
    case "left":
      return {
        translateX: value.interpolate({
          inputRange: [0, 1],
          outputRange: [width * (idx - 1), width * idx],
        }),
      };
    default:
    case "right":
      return {
        translateX: value.interpolate({
          inputRange: [0, 1],
          outputRange: [width * (1 - idx), -width * idx],
        }),
      };
    case "up":
      return {
        translateY: value.interpolate({
          inputRange: [0, 1],
          outputRange: [height * (1 - idx), -height * idx],
        }),
      };
    case "down":
      return {
        translateY: value.interpolate({
          inputRange: [0, 1],
          outputRange: [height * (idx - 1), height * idx],
        }),
      };
  }
}

export const WithPushTransition = ({
  contentKey,
  children,
  duration,
  easing,
  style,
  direction,
}: AnimatedMoveInProps) => {
  const currentKey = contentKey ?? children.key;

  const [[width, height], setLayout] = useState([0, 0]);
  const [views, setViews] = useState([[currentKey, children] as const]);

  const value = useMemo(() => new Animated.Value(1), []);

  const animation = useMemo(
    () =>
      Animated.timing(value, {
        toValue: 1,
        duration: duration ?? 1000,
        easing: easing || Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    [value, duration]
  );

  useEffect(() => {
    if (views[0][0] != currentKey) {
      let valid = true;
      setViews([[currentKey, children], ...views]);
      animation.stop();
      value.setValue(0);
      animation.start(() => {
        if (valid) {
          setViews([[currentKey, children]]);
        }
      });
      return () => {
        valid = false;
      };
    } else if (views[0][1] != children) {
      const updatedViews = [...views];
      updatedViews[0] = [views[0][0], children];
      setViews(updatedViews);
    }
  }, [currentKey, children]);

  return (
    <View
      style={[{ position: "relative" }, style]}
      onLayout={(event) =>
        setLayout([
          event.nativeEvent.layout.width,
          event.nativeEvent.layout.height,
        ])
      }
    >
      {views.map(([key, view], idx) => (
        <Animated.View
          key={`animated_${key}`}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: [createTransform(value, idx, width, height, direction)],
          }}
        >
          {view}
        </Animated.View>
      ))}
    </View>
  );
};
