import React, { useState, useEffect, useMemo, ReactNode } from "react";
import {
  Animated,
  View,
  Easing,
  ViewStyle,
  Text,
  EasingFunction,
} from "react-native";

export type WithPushTransitionProps = {
  children: React.ReactNode;
  /** A unique key for the currently displayed content. When changing content update this key to trigger a transition. */
  contentKey: string | number;
  /** The animation duration. */
  duration?: number;
  /** The style for the container View of the content */
  style?: ViewStyle;
  /** The easing function for the transition animation. */
  easing?: EasingFunction;
  /** The direction for the push animation. */
  direction?: "left" | "right" | "up" | "down";
};

function createTransform(
  value: Animated.Value,
  idx: number,
  width: number,
  height: number,
  direction: WithPushTransitionProps["direction"]
) {
  switch (direction) {
    case "right":
      return {
        translateX: value.interpolate({
          inputRange: [0, 1],
          outputRange: [width * (idx - 1), width * idx],
        }),
      };
    default:
    case "left":
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
  direction = "left",
}: WithPushTransitionProps): ReactNode => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [current, setCurrent] = useState<ReactNode>(children);
  const [currentKey, setCurrentKey] = useState(contentKey);
  const [previous, setPrevious] = useState<ReactNode>();

  const animatedValue = useMemo(() => new Animated.Value(1), []);

  const animation = useMemo(
    () =>
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration ?? 1000,
        easing: easing ?? Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    [animatedValue, duration, easing]
  );

  useEffect(() => {
    if (currentKey !== contentKey) {
      // add the new children to the current views
      setPrevious(current);
      setCurrentKey(contentKey);
      setCurrent(children);

      animation.stop();
      requestAnimationFrame(() => {
        animatedValue.setValue(0);
        requestAnimationFrame(() => {
          animation.start(() => {
            // finish the animation by removing the previous children.
            setPrevious(undefined);
          });
        });
      });
    } else {
      // the key is identical so current view component needs to be updated
      // the animation should continue running
      setCurrent(children);
    }
  }, [currentKey, children]);

  return (
    <View
      style={[{ position: "relative", overflow: "hidden" }, style]}
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
        setHeight(event.nativeEvent.layout.height);
      }}
    >
      {previous && (
        <Animated.View
          style={{
            position: "absolute",
            width,
            height,
            transform: [
              createTransform(animatedValue, 1, width, height, direction),
            ],
          }}
        >
          {previous}
        </Animated.View>
      )}
      <Animated.View
        style={{
          position: "absolute",
          width,
          height,
          transform: [
            createTransform(animatedValue, 0, width, height, direction),
          ],
        }}
      >
        {current}
      </Animated.View>
    </View>
  );
};
