import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import * as Location from "expo-location";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import ROUTE_PATH from "@/libs/route-path";
import GradientBackground from "@/components/common/GradientEllipse";
import { Button, ButtonText } from "@/components/ui/button";
import { socialButtons } from "@/utils/constants";
import { useAuthUser } from "@/contexts/AuthContext";
import useAxios from "@/hooks/useAxios";

// Validation schema
const schema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
  agree: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

export default function SignupScreen() {
  const router = useRouter();
  const { authUser } = useAuthUser();

  const {
    request: registerUser,
    loading: registerUserLoading,
    error: registerUserError,
  } = useAxios();

  console.log("authUser", authUser);

  const [location, setLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: any) => {
    const payloadToSend = {
      ...payload,
      userCoordinates: location || { lat: 0, long: 0 },
    };

    const { data, error } = await registerUser({
      url: "/user/register-user",
      method: "POST",
      payload: payloadToSend,
    });

    console.log("Signup response:", data, error);

    if (!error) {
      data.status === 200
        ? router.push(ROUTE_PATH.AUTH.VERIFICATION)
        : data.status === 201
        ? router.push(ROUTE_PATH.AUTH.LOGIN)
        : null;
    } else {
      console.log(error || "Something went wrong");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: loc.coords.latitude,
        long: loc.coords.longitude,
      });
    })();
  }, []);

  return (
    <GradientBackground
      animateBlobs
      darkMode={false}
      animationType="pulse"
      animationSpeed={1000}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 100,
              flexGrow: 1,
            }}
          >
            <View className="w-full max-w-md self-center">
              <Text className="text-3xl mb-6 mt-6 font-lexend-bold text-black">
                Create Account
              </Text>

              {[
                {
                  name: "fullName",
                  label: "Full Name",
                  keyboardType: "default",
                },
                {
                  name: "email",
                  label: "Your Email",
                  keyboardType: "email-address",
                },
                {
                  name: "phoneNumber",
                  label: "Phone Number",
                  keyboardType: "phone-pad",
                },
                { name: "password", label: "Password", secureTextEntry: true },
                {
                  name: "confirmPassword",
                  label: "Confirm Password",
                  secureTextEntry: true,
                },
              ].map((field) => (
                <View key={field.name} className="mb-4">
                  <FormLabel label={field.label} />
                  <Controller
                    control={control}
                    name={field.name as any}
                    render={({ field: { value, onChange } }) => (
                      <StyledInput
                        placeholder={`Enter ${field.label}`}
                        value={value}
                        onChangeText={onChange}
                        keyboardType={field.keyboardType}
                        secureTextEntry={field.secureTextEntry}
                      />
                    )}
                  />
                  <FormError
                    error={errors?.[field.name as keyof typeof errors]?.message}
                  />
                </View>
              ))}

              <View className="flex-row items-center mb-4">
                <Controller
                  control={control}
                  name="agree"
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      value={value}
                      onValueChange={onChange}
                      color={value ? "#E55150" : undefined}
                      className="mr-4"
                    />
                  )}
                />
                <Text className="text-xs text-app-color-grey font-lexend-bold flex-1">
                  By continuing, you agree to our Terms of Services, Privacy
                  Policy.
                </Text>
              </View>
              <FormError error={errors.agree?.message} />

              <Pressable
                onPress={handleSubmit(onSubmit)}
                className="bg-app-color-red rounded-lg py-3 mx-7 items-center mb-4"
                android_ripple={{ color: "#c53030" }}
              >
                <Text className="text-white font-lexend-semibold text-base">
                  Sign up
                </Text>
              </Pressable>

              <Text className="text-center text-app-color-grey font-lexend mb-4">
                or Sign up with
              </Text>

              {socialButtons.map(
                ({ icon: Icon, iconName, color, text }, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="xl"
                    className="my-1 mx-4 border border-app-color-warmgreylight rounded-lg flex-row items-center justify-center"
                  >
                    <View className="mr-3 w-6 items-center">
                      <Icon name={iconName} size={20} color={color} />
                    </View>
                    <ButtonText className="text-sm font-lexend">
                      {text}
                    </ButtonText>
                  </Button>
                )
              )}

              <View className="flex-row items-center justify-center mt-6">
                <Text className="text-app-color-grey font-lexend-bold">
                  Already have an account?
                </Text>
                <Pressable onPress={() => router.push(ROUTE_PATH.AUTH.LOGIN)}>
                  <Text className="text-app-color-softindigo font-lexend-bold ml-2">
                    Login
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

// Reusable Components
const FormLabel = ({ label }: { label: string }) => (
  <Text className="text-xs text-app-color-grey mb-2 font-lexend-bold">
    {label}
  </Text>
);

const FormError = ({ error }: { error?: string }) =>
  error ? (
    <Text className="text-red-500 font-lexend text-xs mt-1">{error}</Text>
  ) : null;

const StyledInput = (props: any) => (
  <TextInput
    className="border border-app-color-warmgreylight font-lexend rounded-md px-4 py-3 text-black"
    placeholderTextColor="#999"
    {...props}
  />
);
