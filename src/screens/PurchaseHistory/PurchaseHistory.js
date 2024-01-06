import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
import { Button, DataTable, Accordion } from 'react-native-paper';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPrint from 'react-native-print';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.js'
import Navbar from '../../components/Navbar';
import client from '../../config.js'

const PurchaseHistory = () => {
    const navigation = useNavigation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [ingredients, setIngredient] = useState([]);
    const [expandedIngredients, setExpandedIngredients] = useState([]);
    const [loading, setLoading] = useState(false);

    const getPurchaseHistory = async () => {
        try {
            setLoading(true)
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-ingredient-purchase-history', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(result.data.history);
            setPurchaseHistory(result.data.history)
            setLoading(false)
        } catch (error) {
            console.log(`getting Purchase History error ${error}`);
        }
    }
    const getIngredients = async () => {
        try {
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-ingredients', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            setIngredient(result.data.ingredients)
        } catch (error) {
            console.log(`getting recipes error ${error}`);
        }
    }

    useEffect(() => {
        getPurchaseHistory();
        getIngredients();
    }, []);

    const handleIngredientToggle = (ingredientName) => {
        setExpandedIngredients((prevExpanded) =>
            prevExpanded.includes(ingredientName)
                ? prevExpanded.filter((name) => name !== ingredientName)
                : [...prevExpanded, ingredientName]
        );
    };

    const renderAccordionContent = (ingredientName) => {
        const ingredientInvoices = purchaseHistory.find((item) => item.ingredient.name === ingredientName)

        return (
            <>
                {
                    ingredientInvoices ? (
                        ingredientInvoices.invoices.map((invoice, index) => (
                            <DataTable.Row
                                key={index}
                                style={{ backgroundColor: 'white' }}
                            >
                                <DataTable.Cell style={[styles.cell, { flex: 0.2 }]}></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{invoice.invoiceNumber}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{invoice.vendor}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{invoice.uploadDate}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{invoice.quantity}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{invoice.unit}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>${invoice.unitPrice}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>${invoice.total}</DataTable.Cell>
                            </DataTable.Row>
                        ))
                    ) : (
                        <DataTable.Row
                            style={{ backgroundColor: 'white' }}
                        >
                            <DataTable.Cell style={styles.cell}>No purchase history</DataTable.Cell>
                        </DataTable.Row>
                    )
                }
            </>
        )
    };

    return (
        <View>
            <View>
                <Navbar heading="Ingredients Purchase History" />
            </View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.tableButtonContainer}>
                        <View style={styles.leftTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Add Invoice</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnSky}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Include All Orders</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Invoice Date: All Time</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnSky}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
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
                                underlayColor="transparent"
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
                    <DataTable.Cell style={[styles.cell, { flex: 0.2 }]}></DataTable.Cell>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Ingredient Name</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Invoice Number</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Vendor</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Purchase Date</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Quantity</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Unit</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Unit Price</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total</span></DataTable.Title>
                </DataTable.Header>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                ) : (
                    ingredients.map((item, index) => (
                        <React.Fragment key={index}>
                            <DataTable.Row
                                style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                                onPress={() => handleIngredientToggle(item.name)}
                            >
                                <DataTable.Cell style={[styles.cell, { flex: 0.2 }]}>
                                    <Icon.Button style={{}}
                                        name={expandedIngredients.includes(item.name) ? 'minus-square' : 'plus-square'}
                                        onPress={() => handleIngredientToggle(item.name)}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        color={"#1f82d2"}
                                        iconStyle={{ padding: 0, marginRight: 0, fontSize: 15 }}>
                                    </Icon.Button>
                                </DataTable.Cell>
                                <DataTable.Cell style={[styles.cell, { flex: 8 }]}>
                                    <span style={{ fontWeight: '700' }}>{item.name}</span>
                                </DataTable.Cell>
                            </DataTable.Row>

                            {expandedIngredients.includes(item.name) && renderAccordionContent(item.name)}
                        </React.Fragment>
                    ))
                )
                }
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
        // marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: 'white'
    },
    evenRow: {
        backgroundColor: '#f2f0f0',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
})

export default PurchaseHistory;