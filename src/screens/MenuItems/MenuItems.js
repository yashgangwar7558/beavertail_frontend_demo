import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.js'
import Navbar from '../../components/Navbar';
import client from '../../config.js'

const MenuItems = () => {
    const navigation = useNavigation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

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

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const deleteRecipe = async (recipeId) => {
        try {
            const id = { recipeId }
            const result = await client.post('/delete-recipe', id, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(result.data);
            if (result.data.success) {
                getRecipes();
                closeModal();
            }
        } catch (error) {
            console.log(`getting recipes error ${error}`);
        }
    }

    const closeModal = () => {
        setSelectedRecipe(null);
    };

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
                        <TouchableOpacity key={index} onPress={() => handleRecipeClick(item)}>
                            <DataTable.Row
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
                        </TouchableOpacity>
                    ))}
                </DataTable>
            </View>

            {/* Hover Screen */}
            <Modal isVisible={selectedRecipe !== null} onBackdropPress={closeModal}>
                <View style={styles.modalContainer}>
                    {selectedRecipe && (
                        <View style={styles.recipeContainer}>
                            <View style={styles.recipeNameNavbar}>
                                <Text style={[styles.uppercaseText, { fontWeight: 'bold', color: 'white', fontSize: '18px' }]}>{selectedRecipe.name}</Text>
                                <Button onPress={closeModal}>Close</Button>
                            </View>
                            <ScrollView>
                                <View style={styles.recipeDetails}>
                                    <View style={styles.detailsContainer}>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Type:</span> {selectedRecipe.category}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Inventory:</span> {selectedRecipe.inventory ? 'Yes' : 'No'}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Yields:</span> {selectedRecipe.yields[0].quantity} {selectedRecipe.yields[0].unit}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Shelf Life:</span> 1 Day</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Method of Preparation:</span></Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}>{selectedRecipe.methodPrep}</Text>
                                    </View>
                                    <View style={styles.imageContainer}>
                                        {/* <Image source={{ uri: `data:${selectedRecipe.photo.img.contentType};base64,${ImageBase64.encode(selectedRecipe.photo.img.data.data)}` }} style={styles.recipeImage} /> */}
                                        <Image source={{ uri: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D` }} style={styles.recipeImage} />
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={styles.recipeButtons}>
                                <Button style={styles.button}>
                                    <Text style={styles.buttonText}>Edit Recipe</Text>
                                </Button>
                                <Button style={styles.button} onPress={() => { deleteRecipe(selectedRecipe._id) }}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </Button>
                                <Button style={styles.button}>
                                    <Text style={styles.buttonText}>Copy Recipe</Text>
                                </Button>
                                <Button style={styles.button}>
                                    <Text style={styles.buttonText}>Print</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>
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
        backgroundColor: '#f2f0f0',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 10,
        maxHeight: '80%',
        width: '70%',
        alignSelf: 'center',
    },
    recipeContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
    },
    recipeNameNavbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#06bcee',
        color: '#fff',
    },
    uppercaseText: {
        textTransform: 'uppercase',
    },
    recipeDetails: {
        flexDirection: 'row',
        padding: 20,
    },
    detailsContainer: {
        flex: 1,
        paddingRight: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeImage: {
        width: '70%',
        height: 250,
        borderRadius: 5,
        resizeMode: 'cover',
    },
    recipeButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    button: {
        backgroundColor: '#06bcee',
        paddingVertical: 4,
        paddingHorizontal: 7,
        marginRight: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#06bcee',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default MenuItems;
