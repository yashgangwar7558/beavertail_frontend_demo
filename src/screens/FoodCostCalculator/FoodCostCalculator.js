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

const FoodCostCalculator = () => {
    const navigation = useNavigation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [typeWiseSales, setTypeWiseSales] = useState([]);
    const [recipeWiseSales, setRecipeWiseSales] = useState([]);
    const [expandedTypes, setExpandedTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const getRecipesSalesData = async () => {
        try {
            setLoading(true)
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-recipe-sales-info', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            setTypeWiseSales(result.data.allTypesSalesDataArray)
            setRecipeWiseSales(result.data.allRecipesSalesData)
            setLoading(false)
        } catch (error) {
            console.log(`getting recipe sales data error ${error}`);
        }
    }

    useEffect(() => {
        getRecipesSalesData();
    }, []);

    const handleTypesToggle = (typeName) => {
        setExpandedTypes((prevExpanded) =>
            prevExpanded.includes(typeName)
                ? prevExpanded.filter((type) => type !== typeName)
                : [...prevExpanded, typeName]
        );
    };

    const renderAccordionContent = (typeName) => {
        const typeWiseRecipes = recipeWiseSales.filter((item) => item.type === typeName);
        console.log(typeWiseRecipes);
        return (
            typeWiseRecipes.map((item, index) => (
                <DataTable.Row
                    key={index}
                    style={{ backgroundColor: 'white' }}
                >
                    <DataTable.Cell style={[styles.cell, {flex: 0.2}]}></DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>{item.type}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>{item.name}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>${(item.avgCost).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>{item.quantitySold}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>${(item.totalFoodCost).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>${(item.totalSales).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>${(item.totalRevenueWomc).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>{(item.theoreticalCostWomc).toFixed(2)}%</DataTable.Cell>
                </DataTable.Row>
            ))
        )
    };

    return (
        <View>
            <View>
                <Navbar heading="Food Cost Calculator" />
            </View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.leftTableButtons}>
                        <Icon.Button
                            style={styles.tableNavBtnMidBlue}
                            name="calendar"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                            color={"white"}
                        >
                            <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>June 26, 2019 - July 24, 2019</Text>
                        </Icon.Button>
                    </View>
                    <View style={styles.rightTableButtons}>
                        <Icon.Button
                            style={styles.tableNavBtnMidBlue}
                            name="print"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                            color={"white"}
                        >
                            <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Print Report</Text>
                        </Icon.Button>
                        <Icon.Button
                            style={styles.tableNavBtnMidBlue}
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
            </View>

            <DataTable style={styles.dataTable}>
                <DataTable.Header style={styles.header}>
                    <DataTable.Title style={[styles.headerCell, {flex: 0.2}]}></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Menu Item Type</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Menu Item</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Avg. Cost</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Items Sold</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total Cost</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total Sales</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total Revenue</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Theoretical Cost</span></DataTable.Title>
                </DataTable.Header>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                ) : (
                    typeWiseSales.map((item, index) => (
                        <React.Fragment key={index}>
                            <DataTable.Row
                                style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                                onPress={() => handleTypesToggle(item.type)}
                            >
                                <DataTable.Cell style={[styles.cell, {flex: 0.2}]}>
                                    <Icon.Button style={{}}
                                        name={expandedTypes.includes(item.type) ? 'minus-square' : 'plus-square'}
                                        onPress={() => handleTypesToggle(item.type)}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        color={"#1f82d2"}
                                        iconStyle={{ padding: 0, marginRight: 0, fontSize: 15 }}>
                                    </Icon.Button>
                                </DataTable.Cell>
                                <DataTable.Cell style={[styles.cell, {flex: 1}]}>
                                    <span style={{ fontWeight: '700' }}>{item.type}</span>
                                    <span style={{ fontWeight: '700' }}> ({item.count})</span>
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.cell}></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>${(item.avgCost).toFixed(2)}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>{item.itemsSold}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>${(item.totalFoodCost).toFixed(2)}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>${(item.totalSales).toFixed(2)}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>${(item.totalRevenueWomc).toFixed(2)}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>{(item.theoreticalCostWomc).toFixed(2)}%</span></DataTable.Cell>
                            </DataTable.Row>

                            {expandedTypes.includes(item.type) && renderAccordionContent(item.type)}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#e8e8e8',
    },
    leftTableButtons: {
        flexDirection: 'row'
    },
    rightTableButtons: {
        flexDirection: 'row'
    },
    tableNavBtnMidBlue: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 5,
        backgroundColor: "#4496cd",
        justifyContent: "center"
    },
    tableNavBtnSky: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 5,
        backgroundColor: "#72b8f2",
        justifyContent: "center"
    },
    dataTable: {
        // marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: 'white'
    },
})

export default FoodCostCalculator;