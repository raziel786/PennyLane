import React, { useState } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native'
import Header from '../../components/Header'
import { searchProducts } from '../../api/calls'
import { useApi } from '../../api'
import { formatAmount } from '../../utils'
import RadioButton from '../../components/RadioButton'
import { useNavigation } from '@react-navigation/native'
import Button from '../../components/Button'
import { CustomerData, ProductData } from '../../types'

interface ListItemProps {
  product: ProductData
  selectedProducts: ProductData[]
  handleProductSelection: (product: Product) => void
}

const ListItem: React.FC<ListItemProps> = ({
  product,
  selectedProducts,
  handleProductSelection,
}) => {
  const { label, unit_price } = product
  const isSelected = selectedProducts.some(
    (selectedProduct) => selectedProduct.id === product.id,
  )

  return (
    <TouchableOpacity onPress={() => handleProductSelection(product)}>
      <RadioButton checked={isSelected}>
        <View style={styles.listItemRow}>
          <Text style={styles.listItemText}>{label}</Text>
          <Text>{formatAmount(unit_price)}</Text>
        </View>
      </RadioButton>
    </TouchableOpacity>
  )
}

interface SearchProductsProps {
  route: {
    params: {
      customer: CustomerData
      invoice?: { invoice_lines: ProductData[] } | null
    }
  }
}

const SearchProducts: React.FC<SearchProductsProps> = ({
  route: {
    params: { customer, invoice = null },
  },
}) => {
  const apiClient = useApi()
  const navigation = useNavigation()

  const [productList, setProductList] = useState<Product[]>([])
  const [noResults, setNoResults] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    invoice ? [...invoice.invoice_lines] : [],
  )

  const onNext = () => {
    const invoiceLines = selectedProducts.map((product) => ({
      product_id: product.id || product.product_id,
      quantity: 1,
      label: product.label,
      unit: product.unit,
      vat_rate: product.vat_rate,
      price: Number(product.unit_price || product.price),
      tax: Number(product.unit_tax || product.tax),
    }))
    navigation.push('Confirmation', {
      invoiceLines,
      customer,
      invoice,
    })
  }

  const handleProductSelection = (product: Product) => {
    setSelectedProducts((prevSelectedProducts) => {
      const isProductSelected = prevSelectedProducts.some(
        (selectedProduct) => selectedProduct.id === product.id,
      )

      if (isProductSelected) {
        return prevSelectedProducts.filter(
          (selectedProduct) => selectedProduct.id !== product.id,
        )
      } else {
        return [...prevSelectedProducts, product]
      }
    })
  }

  const searchForProducts = async (text: string) => {
    const {
      data: { products },
    } = await searchProducts(apiClient, text.toLowerCase())
    setNoResults(products.length === 0)
    setProductList(products)
  }

  return (
    <View style={styles.container}>
      <Header title="Search Products" />
      <View style={styles.innerContainer}>
        <TextInput
          onSubmitEditing={(e) => searchForProducts(e.nativeEvent.text)}
          style={styles.searchInput}
          placeholder="Search Products"
        />
        {selectedProducts.length > 0 && (
          <View>
            <Text>Selected Products</Text>
            <View style={styles.wrap}>
              {selectedProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => handleProductSelection(product)}
                >
                  <Text style={styles.capsule}>{product.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {noResults && <Text style={styles.resultCount}>No results found</Text>}
        <FlatList
          data={productList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              product={item}
              selectedProducts={selectedProducts}
              handleProductSelection={handleProductSelection}
            />
          )}
          style={styles.listContainer}
        />
        <Button onPress={onNext} title="Next" />
      </View>
    </View>
  )
}

export default SearchProducts

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    justifyContent: 'space-between',
    padding: 16,
    height: '85%',
  },
  capsule: {
    fontSize: 10,
    color: 'grey',
    backgroundColor: 'lightgrey',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 2,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  searchInput: {
    borderColor: 'grey',
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    borderRadius: 8,
    width: '100%',
  },
  resultCount: {
    paddingVertical: 8,
    textAlign: 'right',
    fontStyle: 'italic',
    color: 'grey',
  },
  listContainer: {
    maxHeight: '50%',
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  listItemText: {
    paddingVertical: 6,
  },
})
