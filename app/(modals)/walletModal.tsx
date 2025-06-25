import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import Input from '@/components/Input'
import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService'
import { WalletType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'

const WalletModal = () => {

    const { user, updateUserData } = useAuth()
    const [wallet, setWallet] = useState<WalletType>({
        name: "",
        image: null
    })

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const oldWallet: {name: string, image: string, id: string} = useLocalSearchParams()
    console.log("old wallet: ", oldWallet);
    
    useEffect(() => {
        if(oldWallet?.id){
            setWallet({
                name: oldWallet?.name,
                image: oldWallet?.image
            })
        }
    }, [])

    const onSubmit = async () => {
        let { name, image } = wallet
        if (!name.trim() || !image) {
            Alert.alert("Wallet", "Please fill all the fields")
            return;
        }

        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        }

        if(oldWallet?.id) data.id = oldWallet?.id
        setIsLoading(true)
        const res = await createOrUpdateWallet(data)
        setIsLoading(false)
        if (res.success) {
            router.back()
        } else {
            Alert.alert("Wallet", res.msg)
        }
    }

    const onDelete = async () => {
        if(!oldWallet?.id) return
        setIsLoading(true)
        const res = await deleteWallet(oldWallet?.id);
        setIsLoading(false)
        if(res.success){
            router.back()
        }else{
            Alert.alert("Wallet", res.msg)
        }
    }

    const showDeleteAlert = () => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel delete"),
                    style: 'cancel'
                },
                {
                    text: "Delete",
                    onPress: () => onDelete(),
                    style: "destructive"
                }
            ]
        )
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title={oldWallet?.id ? "Update Wallet" : 'New Wallet'}
                    leftIcon={<BackButton />}
                    style={{
                        marginBottom: spacingY._10
                    }} />

                {/* form */}

                <ScrollView contentContainerStyle={styles.form}>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Wallet Name</Typo>
                        <Input
                            placeholder='Salary'
                            value={wallet.name}
                            onChangeText={(value) => {
                                setWallet({ ...wallet, name: value })
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Wallet Icon</Typo>
                            <ImageUpload 
                            file={wallet.image}
                            onClear={() => setWallet({ ...wallet, image: null })}
                            onSelect={(file) => setWallet({ ...wallet, image: file})}
                            placeholder='Upload Image'/>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.footer}>
                {
                    oldWallet?.id && !isLoading && (
                        <Button
                        onPress={showDeleteAlert}
                        style={{
                            backgroundColor: colors.rose,
                            paddingHorizontal: spacingX._15
                        }}
                        >
                            <Icons.Trash
                            color={colors.white}
                            size={verticalScale(24)}
                            weight='bold'
                            />
                        </Button>
                    )
                }
                <Button onPress={onSubmit} loading={isLoading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight={'700'}>
                        {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default WalletModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20
    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
    },
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500
    },
    editIcon: {
        position: 'absolute',
        bottom: spacingY._5,
        right: spacingX._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.75,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7
    },
    inputContainer: {
        gap: spacingY._10
    }

})