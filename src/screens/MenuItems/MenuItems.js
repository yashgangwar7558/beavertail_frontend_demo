import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.js'
import Navbar from '../../components/Navbar';
import client from '../../config.js'

const MenuItems = () => {
    const navigation = useNavigation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);

    const getRecipes = async () => {
        try {
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-recipes', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(result.data.recipes);
            setRecipes(result.data.recipes)
        } catch (error) {
            console.log(`getting recipes error ${error}`);
        }
    }

    useEffect(() => {
        getRecipes();
    }, []);

    return (
        <View>
            <View>
                <Navbar heading="Menu Items" />
            </View>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('MenuBuilder')} style={styles.addButton}>
                    <Text style={styles.addText}>Add new item</Text>
                </TouchableOpacity>

                {/* Table */}
                <DataTable style={styles.dataTable}>
                    <DataTable.Header style={styles.header}>
                        <DataTable.Title style={styles.headerCell}>Name</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Type</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>On Inventory</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Cost</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Menu Price</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Net Profit</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Cost %</DataTable.Title>
                    </DataTable.Header>

                    {recipes.map((item, index) => (
                        <DataTable.Row
                            key={index}
                            style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                        >
                            <DataTable.Cell style={styles.cell}>{item.name}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.category}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.inventory ? 'Yes' : 'No'}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>${(item.cost).toFixed(2)}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>${(item.menuPrice).toFixed(2)}</DataTable.Cell>
                            <DataTable.Cell style={[styles.cell, { backgroundColor: (item.menuPrice - item.cost) < 0 ? '#ed6d7b' : '#8eeda8' }]}>${(item.menuPrice - item.cost).toFixed(2)}</DataTable.Cell>
                            <DataTable.Cell style={[styles.cell, { backgroundColor: (item.menuPrice - item.cost) < 0 ? '#ed6d7b' : '#8eeda8' }]}>{((item.cost / item.menuPrice) * 100).toFixed(1)}%</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    addButton: {
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        margin: 5,
    },
    addText: {
        color: '#06bcee',
        fontWeight: 'bold',
    },
    dataTable: {
        marginTop: 20,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    headerCell: {
        paddingLeft: 10,
    },
    cell: {
        paddingLeft: 10,
    },
    evenRow: {
        backgroundColor: '#fff',
    },
    oddRow: {
        backgroundColor: '#f2f2f2',
    },
});

export default MenuItems;
