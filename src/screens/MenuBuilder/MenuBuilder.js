import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Picker } from 'react-native';
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
    const [currentCost, setCurrentCost] = useState();
    const [unitMaps, setUnitMaps] = useState([]);
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

    const categories = ['Roll', 'Pizza', 'Burger', 'Drink', 'Starter', 'Snacks'];
    const menuTypes = ['Special', 'Breads', 'Breakfast', 'MainCourse', 'Starters', 'Chefs Special', 'Shakes'];

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
    const getUnitMaps = async () => {
        try {
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-unitmaps', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            setUnitMaps(result.data.unitMaps)
        } catch (error) {
            console.log(`getting unitmaps error ${error}`);
        }
    }
    const costEstimation = async () => {
        let totalCost = 0;

        for (const ingredient of recipeData.ingredients) {

            const matchingIngredient = ingredients.find(
                (allIngredient) => allIngredient._id.toString() === ingredient.ingredient_id
            );

            if (matchingIngredient && ingredient.quantity !== '' && ingredient.unit !== '') {
                const unitMap = unitMaps.find(
                    (unitMap) => unitMap.ingredient_id.toString() === ingredient.ingredient_id
                );
                const toUnit = unitMap ? unitMap.toUnit : ingredient.unit;
                const convertedQuantity = ingredient.quantity * getConversionFactor(ingredient.unit, toUnit, unitMap.fromUnit);
                const costPerUnit = matchingIngredient.avgCost / getConversionFactor(matchingIngredient.invUnit, toUnit, unitMap.fromUnit) || 0;
                totalCost += costPerUnit * convertedQuantity;
            }
        }

        setCurrentCost(totalCost);
    }

    const getConversionFactor = (fromUnit, toUnit, fromUnitArray) => {
        const conversionObject = fromUnitArray.find((unit) => unit.unit === fromUnit);
        return conversionObject ? conversionObject.conversion : 1;
    };

    useEffect(() => {
        getIngredients();
        getUnitMaps();
        costEstimation();
    }, [recipeData]);


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
        if (text.length == 0) {
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

    const handleDeleteIngredient = (index) => {
        const updatedIngredients = [...recipeData.ingredients];
        updatedIngredients.splice(index, 1);
        setRecipeData({ ...recipeData, ingredients: updatedIngredients });
    };

    const handleDeleteYield = (index) => {
        const updatedYields = [...recipeData.yields];
        updatedYields.splice(index, 1);
        setRecipeData({ ...recipeData, yields: updatedYields });
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
                    <Picker
                        style={styles.input}
                        selectedValue={recipeData.category}
                        onValueChange={(itemValue) => setRecipeData({ ...recipeData, category: itemValue })}
                    >
                        <Picker.Item label="Select a category" value="" />
                        {categories.map((category, index) => (
                            <Picker.Item key={index} label={category} value={category} />
                        ))}
                    </Picker>
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
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDeleteYield(index)}
                            >
                                <Text style={{ color: 'white' }}>Delete</Text>
                            </TouchableOpacity>
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
                        <Text style={{ color: 'green' }}>Image Uploaded Successfully!</Text>
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
                            <Picker
                                style={styles.smallInput}
                                selectedValue={ingredient.unit}
                                onValueChange={(itemValue) => handleIngredientsChange(index, 'unit', itemValue)}
                            >
                                <Picker.Item label="Unit" value="" />
                                {
                                    unitMaps.find(map => map.ingredient_id === ingredient.ingredient_id)?.fromUnit.map((unit, index) => (
                                        <Picker.Item key={index} label={unit.unit} value={unit.unit} />
                                    ))
                                }
                            </Picker>
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Notes"
                                value={ingredient.notes}
                                onChangeText={(text) => handleIngredientsChange(index, 'notes', text)}
                            />
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDeleteIngredient(index)}
                            >
                                <Text style={{ color: 'white' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <Text style={{fontSize: '15px', fontWeight: 'bold'}}>Estimated Cost: <span style={{ color: 'green' }}>${currentCost}</span></Text>
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
                    <Picker
                        style={styles.input}
                        selectedValue={recipeData.menuType}
                        onValueChange={(itemValue) => setRecipeData({ ...recipeData, menuType: itemValue })}
                    >
                        <Picker.Item label="Select a type" value="" />
                        {menuTypes.map((type, index) => (
                            <Picker.Item key={index} label={type} value={type} />
                        ))}
                    </Picker>
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
        backgroundColor: '#fff',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 12,
        borderRadius: 8,
    },
    multilineInput: {
        height: 120,
        borderRadius: 8,
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
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
        borderRadius: 20,
        marginBottom: 10,
        backgroundColor: '#fff',
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
    deleteBtn: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
};

export default MenuBuilder;