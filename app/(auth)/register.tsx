import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React, { useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'

const Register = () => {

    const nameRef = useRef("")
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { register: registerUser } = useAuth()

    const handleSubmit = async () => {
        if (!nameRef.current || !emailRef.current || passwordRef.current) {
            Alert.alert("Sign up", "Please fill all the fields")
            return;
        }
        setIsLoading(true)
        const res = await registerUser(
            emailRef.current, 
            passwordRef.current, 
            nameRef.current
        )
        setIsLoading(false)
        if(!res.success){
            Alert.alert("Sign Up", res.msg)
        }

    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />
                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={'800'}>
                        Let's
                    </Typo>
                    <Typo size={30} fontWeight={'800'}>
                        Get Started
                    </Typo>
                </View>

                {/* form */}

                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter}>
                        Create an account to track your expenses
                    </Typo>
                    <Input
                        onChangeText={(value) => (nameRef.current = value)}
                        placeholder='Enter your name' icon={
                            <Icons.User
                                size={verticalScale(26)}
                                color={colors.neutral300}
                                weight='fill' />
                        } />
                    <Input
                        onChangeText={(value) => (emailRef.current = value)}
                        placeholder='Enter your email' icon={
                            <Icons.At
                                size={verticalScale(26)}
                                color={colors.neutral300}
                                weight='fill' />
                        } />
                    <Input
                        onChangeText={(value) => (passwordRef.current = value)}
                        secureTextEntry
                        placeholder='Enter your password' icon={
                            <Icons.Lock
                                size={verticalScale(26)}
                                color={colors.neutral300}
                                weight='fill' />
                        } />

                    <Button loading={isLoading} onPress={handleSubmit}>
                        <Typo fontWeight={"700"} color={colors.black} size={21}>
                            Sign Up
                        </Typo>
                    </Button>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Typo size={15}>Already have an account?</Typo>
                    <Pressable onPress={() => router.navigate("/(auth)/login")}>
                        <Typo size={15} fontWeight={"700"} color={colors.primary}>Login</Typo>
                    </Pressable>
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: spacingY._7
    },
    welcomeImage: {
        width: '100%',
        height: verticalScale(300),
        alignSelf: 'center',
        marginTop: verticalScale(100)
    },
    RegisterButton: {
        alignSelf: 'flex-end',
        marginRight: spacingX._20,
    },
    form: {
        gap: spacingY._20
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
        color: colors.text
    },
    footer: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    footerText: {
        textAlign: 'center',
        color: colors.text,
        fontSize: verticalScale(15)
    }
})