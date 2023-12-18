import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext.js'
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../components/Navbar'
import { useDropzone } from 'react-dropzone';
import client from '../../config.js'

const MenuBuilder = () => {
    const navigation = useNavigation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [ingredients, setIngredient] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState({});

    const getIngredients = async () => {
        try {
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-ingredients', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(result.data.ingredients);
            setIngredient(result.data.ingredients)
        } catch (error) {
            console.log(`getting recipes error ${error}`);
        }
    }

    useEffect(() => {
        getIngredients();
    }, []);

    const [recipeData, setRecipeData] = useState({
        userId: userInfo.user.userId,
        name: '',
        category: '',
        yields: [{ quantity: '', unit: '' }],
        photo: null,
        methodPrep: '',
        ingredients: [], // { ingredient_id: '', name: '', category: '', quantity: '', unit: '', notes: '' }
        menuPrice: '',
        menuType: '',
    });

    const handleYieldsChange = (index, field, value) => {
        const updatedYields = [...recipeData.yields];
        updatedYields[index][field] = value;
        setRecipeData({ ...recipeData, yields: updatedYields });
    };

    const handleIngredientSearch = (text) => {
        // Filter ingredients based on search term
        const results = ingredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(results);
        if(text.length == 0) {
            setSearchResults([])
        }
    };

    const handleAddIngredient = (ingredient) => {
        setSelectedIngredient({ ingredient });
        setRecipeData({
            ...recipeData,
            ingredients: [...recipeData.ingredients, {
                ingredient_id: ingredient._id,
                name: ingredient.name,
                category: ingredient.category,
                quantity: '',
                unit: '',
                notes: '',
            }],
        });
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleIngredientsChange = (index, field, value) => {
        const updatedIngredients = [...recipeData.ingredients];
        updatedIngredients[index][field] = value;
        setRecipeData({ ...recipeData, ingredients: updatedIngredients });
    };

    const handleAddItem = (arrayName) => {
        setRecipeData({
            ...recipeData,
            [arrayName]: [...recipeData[arrayName], {}],
        });
    };

    const onDrop = (acceptedFiles) => {
        setRecipeData({ ...recipeData, photo: acceptedFiles[0] });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    const handleSubmit = async () => {
        try {
            console.log(recipeData);
            const data = new FormData();
            data.append('userId', recipeData.userId);
            data.append('name', recipeData.name);
            data.append('category', recipeData.category);
            data.append('yields', JSON.stringify(recipeData.yields));
            data.append('photo', recipeData.photo);
            data.append('methodPrep', recipeData.methodPrep);
            data.append('ingredients', JSON.stringify(recipeData.ingredients));
            data.append('menuPrice', recipeData.menuPrice);
            data.append('menuType', recipeData.menuType);
            const result = await client.post('/create-recipe', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
            })
            console.log(result.data);
            if (result.data.success) {
                setRecipeData({
                    userId: userInfo.user.userId,
                    name: '',
                    category: '',
                    yields: [{ quantity: '', unit: '' }],
                    photo: null,
                    methodPrep: '',
                    ingredients: [{ ingredient_id: '', name: '', category: '', quantity: '', unit: '', notes: '' }],
                    menuPrice: '',
                    menuType: '',
                });
                navigation.replace('MenuItems');
            } else {
                alert(result.data.message)
            }
        } catch (error) {
            console.log(`create recipe error ${error}`);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Navbar heading="Create Recipe" />

            <ScrollView
                style={styles.formContainer}
                contentContainerStyle={{ paddingTop: 100 }}
                stickyHeaderIndices={[0]}
            >

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Recipe Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={recipeData.name}
                        onChangeText={(text) => setRecipeData({ ...recipeData, name: text })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Category:</Text>
                    <TextInput
                        style={styles.input}
                        value={recipeData.category}
                        onChangeText={(text) => setRecipeData({ ...recipeData, category: text })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Yields:</Text>
                    {recipeData.yields.map((yieldItem, index) => (
                        <View key={index} style={styles.rowContainer}>
                            <TextInput
                                style={styles.smallInput}
                                keyboardType='numeric'
                                placeholder="Quantity"
                                value={yieldItem.quantity ? yieldItem.quantity.toString() : ''}
                                onChangeText={(text) => handleYieldsChange(index, 'quantity', parseFloat(text))}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Unit"
                                value={yieldItem.unit}
                                onChangeText={(text) => handleYieldsChange(index, 'unit', text)}
                            />
                        </View>
                    ))}
                    <Button style={styles.addBtn} title="Add Yield" onPress={() => handleAddItem('yields')} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Upload photo:</Text>
                    <div {...getRootProps()} style={styles.dropzone}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop an image here, or click to select one</p>
                    </div>
                    {recipeData.photo && (
                        // <Image source={{ uri: recipeData.photo }} style={styles.imagePreview} />
                        <Text style={{color: 'green'}}>Image Uploaded Successfully!</Text>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Method of Preparation:</Text>
                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        multiline
                        numberOfLines={4}
                        value={recipeData.methodPrep}
                        onChangeText={(text) => setRecipeData({ ...recipeData, methodPrep: text })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Ingredients:</Text>
                    {/* Search Input */}
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search ingredients"
                        value={searchTerm}
                        onChangeText={(text) => {
                            setSearchTerm(text);
                            handleIngredientSearch(text);
                        }}
                    />
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <FlatList
                            style={styles.dropdownMenu}
                            data={searchResults}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleAddIngredient(item)}
                                >
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                    {/* Ingredient Inputs */}
                    {recipeData.ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.rowContainer}>
                            <TextInput
                                style={styles.smallInputNonEditable}
                                placeholder="Ingredent Id"
                                value={ingredient.ingredient_id}
                                editable={false}
                                onChangeText={(text) => handleIngredientsChange(index, 'ingredient_id', text)}
                            />
                            <TextInput
                                style={styles.smallInputNonEditable}
                                placeholder="Name"
                                value={ingredient.name}
                                editable={false}
                                onChangeText={(text) => handleIngredientsChange(index, 'name', text)}
                            />
                            <TextInput
                                style={styles.smallInputNonEditable}
                                placeholder="Category"
                                value={ingredient.category}
                                editable={false}
                                onChangeText={(text) => handleIngredientsChange(index, 'category', text)}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Quantity"
                                value={ingredient.quantity ? ingredient.quantity.toString() : ''}
                                onChangeText={(text) => handleIngredientsChange(index, 'quantity', parseFloat(text))}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Unit"
                                value={ingredient.unit}
                                onChangeText={(text) => handleIngredientsChange(index, 'unit', text)}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Notes"
                                value={ingredient.notes}
                                onChangeText={(text) => handleIngredientsChange(index, 'notes', text)}
                            />
                        </View>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Menu Price:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        value={recipeData.menuPrice ? recipeData.menuPrice.toString() : ''}
                        onChangeText={(text) => setRecipeData({ ...recipeData, menuPrice: parseFloat(text) })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Menu Type:</Text>
                    <TextInput
                        style={styles.input}
                        value={recipeData.menuType}
                        onChangeText={(text) => setRecipeData({ ...recipeData, menuType: text })}
                    />
                </View>

                <Button style={styles.createBtn} title="Create Recipe" onPress={handleSubmit} />
            </ScrollView>
        </View>
    );
};

const styles = {
    formContainer: {
        paddingBottom: 40,
        paddingHorizontal: 100,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 12,
        borderRadius: 8,
    },
    multilineInput: {
        height: 120,
        borderRadius: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    smallInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 8,
    },
    smallInputNonEditable: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 8,
        backgroundColor: '#e4e1e6'
    },
    searchBar: {
        height: 40,
        paddingLeft: 10,
        paddingRight: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10
    },
    dropdownMenu: {
        zIndex: 1,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dropzone: {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
    },
    mobileButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
};

export default MenuBuilder;