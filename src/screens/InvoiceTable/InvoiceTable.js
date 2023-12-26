import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPrint from 'react-native-print';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.js'
import Navbar from '../../components/Navbar';
import client from '../../config.js'

const InvoiceTable = () => {
    const navigation = useNavigation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    return (
        <View>
            <View>
                <Navbar heading="Invoices" />
            </View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.tableButtonContainer}>
                        <View style={styles.leftTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Add Invoice</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnSky}
                                name="angle-down"
                                backgroundColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Include All Orders</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Invoice Date: All Time</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnSky}
                                name="angle-down"
                                backgroundColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>All Vendors</Text>
                            </Icon.Button>
                        </View>
                        <View style={styles.rightTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Export As</Text>
                            </Icon.Button>
                        </View>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.tableSearchBar}
                            placeholder='Search'
                            placeholderTextColor="gray"
                        />
                        <View style={styles.searchIcon}>
                            <Icon name="search" size={20} color="gray" />
                        </View>
                    </View>
                </View>
            </View>

            <DataTable style={styles.dataTable}>
                <DataTable.Header style={styles.header}>
                    <DataTable.Title style={styles.headerCell}>Upload Date</DataTable.Title>
                    <DataTable.Title style={styles.headerCell}>Vendor</DataTable.Title>
                    <DataTable.Title style={styles.headerCell}>Invoice Number</DataTable.Title>
                    <DataTable.Title style={styles.headerCell}>Invoice Date</DataTable.Title>
                    <DataTable.Title style={styles.headerCell}>Payment</DataTable.Title>
                    <DataTable.Title style={styles.headerCell}>Status</DataTable.Title>
                    <DataTable.Title style={styles.headerCell}>Total</DataTable.Title>
                </DataTable.Header>
            </DataTable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 60,
    },
    tableNav: {
        width: '100%',
        flexDirection: 'column',
        padding: 12,
        backgroundColor: '#e8e8e8',
    },
    tableButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftTableButtons: {
        flexDirection: 'row'
    },
    rightTableButtons: {
        flexDirection: 'row'
    },
    tableNavBtnBlue: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 30,
        backgroundColor: "#0071cd",
        justifyContent: "center"
    },
    tableNavBtnSky: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 30,
        backgroundColor: "#72b8f2",
        justifyContent: "center"
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    tableSearchBar: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        border: '1px solid gray',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginLeft: 10,
    },
    dataTable: {
        marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
})

export default InvoiceTable;