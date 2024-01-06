import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/AntDesign';
import RNPrint from 'react-native-print';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.js'
import Navbar from '../../components/Navbar';
import client from '../../config.js'

const MenuItems = () => {
    const navigation = useNavigation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(false);

    const getRecipes = async () => {
        try {
            setLoading(true)
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-recipes', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(result.data.recipes);
            setRecipes(result.data.recipes)
            setLoading(false)
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

    // const closeModal = () => {
    //     setSelectedRecipe(null);
    // };

    const closeRecipeDetails = () => {
        setSelectedRecipe(null);
    };

    return (
        <View>
            <View>
                <Navbar heading="Menu Items" />
            </View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.tableButtonContainer}>
                        <View style={styles.leftTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtn}
                                name="plus"
                                onPress={() => navigation.navigate('MenuBuilder')}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Add a New Menu Item</Text>
                            </Icon.Button>
                        </View>
                        <View style={styles.rightTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtn}
                                name="angle-down"
                                onPress={() => navigation.navigate('MenuBuilder')}
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

                <View style={styles.splitScreenContainer}>
                    <View style={styles.tableContainer}>
                        {/* Table */}
                        <DataTable style={styles.dataTable}>
                            <DataTable.Header style={styles.header}>
                                <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Name</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Type</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>On Inventory</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Cost</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Menu Price</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Net Profit</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Cost %</span></DataTable.Title>
                            </DataTable.Header>

                            {loading ? (
                                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                            ) : (
                                recipes.map((item, index) => (
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
                                ))
                            )
                            }
                        </DataTable>
                    </View>

                    {selectedRecipe && (
                        <View style={styles.recipeContainer}>
                            <View style={styles.recipeNameNavbar}>
                                <Icon.Button
                                    name="list-alt"
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ fontSize: 20, marginRight: 5, padding: 0 }}
                                    color={"white"}>
                                    <Text style={[styles.uppercaseText, { fontWeight: '500', color: 'white', fontSize: '18px' }]}>{selectedRecipe.name}</Text>
                                </Icon.Button>
                                <Icon.Button
                                    name="times"
                                    // onPress={closeModal}
                                    onPress={closeRecipeDetails}
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ fontSize: 20, padding: 0, margin: 0 }}
                                    color={"white"}>
                                </Icon.Button>
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
                                <View style={styles.leftButtonsContainer}>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="edit"
                                        onPress={() => { navigation.navigate('MenuBuilder', { editRecipeData: selectedRecipe }), closeModal(); }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Edit Recipe</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="trash"
                                        onPress={() => { deleteRecipe(selectedRecipe._id) }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Delete Recipe</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="print"
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Print</Text>
                                    </Icon.Button>
                                </View>
                                <View style={styles.rightButtonsContainer}>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="line-chart"
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"#0071cd"}
                                    >
                                        <Text style={{ color: '#0071cd', fontSize: 14 }}>Recipe Cost History</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="history"
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"#0071cd"}
                                    >
                                        <Text style={{ color: '#0071cd', fontSize: 14 }}>History</Text>
                                    </Icon.Button>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>


            {/* Hover Screen */}
            {/* <Modal isVisible={selectedRecipe !== null} onBackdropPress={closeModal}> */}
            {/* <View style={styles.modalContainer}>
                    {selectedRecipe && (
                        <View style={styles.recipeContainer}>
                            <View style={styles.recipeNameNavbar}>
                                <Icon.Button
                                    name="list-alt"
                                    backgroundColor="transparent"
                                    iconStyle={{ fontSize: 20, marginRight: 5, padding: 0 }}
                                    color={"white"}>
                                    <Text style={[styles.uppercaseText, { fontWeight: '500', color: 'white', fontSize: '18px' }]}>{selectedRecipe.name}</Text>
                                </Icon.Button>
                                <Icon.Button
                                    name="times"
                                    onPress={closeModal}
                                    backgroundColor="transparent"
                                    iconStyle={{ fontSize: 20, padding: 0, margin: 0 }}
                                    color={"white"}>
                                </Icon.Button>
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
                                        <Image source={{ uri: `data:${selectedRecipe.photo.img.contentType};base64,${ImageBase64.encode(selectedRecipe.photo.img.data.data)}` }} style={styles.recipeImage} />
                                        <Image source={{ uri: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D` }} style={styles.recipeImage} />
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={styles.recipeButtons}>
                                <View style={styles.leftButtonsContainer}>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="edit"
                                        onPress={() => { navigation.navigate('MenuBuilder', { editRecipeData: selectedRecipe }), closeModal(); }}
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Edit Recipe</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="trash"
                                        onPress={() => { deleteRecipe(selectedRecipe._id) }}
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Delete Recipe</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="print"
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Print</Text>
                                    </Icon.Button>
                                </View>
                                <View style={styles.rightButtonsContainer}>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="line-chart"
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"#0071cd"}
                                    >
                                        <Text style={{ color: '#0071cd', fontSize: 14 }}>Recipe Cost History</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="history"
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"#0071cd"}
                                    >
                                        <Text style={{ color: '#0071cd', fontSize: 14 }}>History</Text>
                                    </Icon.Button>
                                </View>
                            </View>
                        </View>
                    )}
                </View> */}
            {/* </Modal> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
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
    tableNavBtn: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 30,
        backgroundColor: "#0071cd",
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
    splitScreenContainer: {
        flex: 1,
        flexDirection: 'row',
        // marginTop: 10,
    },
    tableContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    dataTable: {
        // marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: 'white',
    },
    headerCell: {
        paddingLeft: 10,
        fontWeight: 'bold',
        fontSize: 12,
    },
    cell: {
        paddingLeft: 10,
    },
    evenRow: {
        backgroundColor: '#f2f0f0',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 5,
        maxHeight: '80%',
        width: '70%',
        alignSelf: 'center',
    },
    recipeContainer: {
        // width: '100%',
        // height: '100%',
        flex: 1,
        backgroundColor: '#fff',
        border: '3.5px solid #4697ce',
        borderRadius: 5,
        overflow: 'hidden',
    },
    recipeNameNavbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#4697ce',
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
        justifyContent: 'centre',
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    leftButtonsContainer: {
        flexDirection: 'row',
    },
    rightButtonsContainer: {
        flexDirection: 'row',
    },
    blueBtn: {
        position: "relative",
        // width: 200,
        height: 35,
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
        // borderWidth: 2,
        // borderColor: "#2bb378",
        backgroundColor: "#0071cd",
        justifyContent: "center"
    },
    blueTransparentBtn: {
        position: "relative",
        // width: 200,
        height: 35,
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#0071cd",
        // backgroundColor: "#0071cd",
        justifyContent: "center"
    }
});

export default MenuItems;
