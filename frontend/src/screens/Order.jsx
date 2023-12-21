import React, { useContext, useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
import {
  Box,
  Grid,
  List,
  CardActionArea,
  CardMedia,
  Typography,
  CircularProgress,
  Alert,
  Card,
  ListItemButton,
  CardContent,
  DialogTitle,
  TextField,
  Dialog,
} from "@mui/material";
import { useStyles } from "../styles";
import InBannerAd from "../assets/InBannerAd.png";
// import { listCategories, listProducts } from "../actions";
import { addToOrder, removeFromOrder } from "../actions";
import { Store } from "../Store";
import { clearOrder } from "../actions";

import { useNavigate } from "react-router-dom";

const Order = () => {
  const styles = useStyles();
  const navigate = useNavigate();


  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const loading = false;
  const error = false;
  const loadingProducts = false;
  const errorProducts = false;
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { state, dispatch } = useContext(Store);
  const { orderItems, itemsCount, totalPrice, taxPrice, orderType } =
    state.order;

  useEffect(() => {
    // Fetch all categories on component mount
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch products when selected category changes
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

 
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://self-order-klda.onrender.com/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async (categoryName) => {
    try {
      let apiUrl = "https://self-order-klda.onrender.com/api/products";

      if (categoryName) {
        apiUrl += `?category=${categoryName}`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Shuffle array to display random products
      const shuffledProducts = shuffleArray(data);
      setProducts(shuffledProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  // Function to shuffle an array
const shuffleArray = (array) => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };
  const productClickHandler = (p) => {
    setProduct(p);
    setIsOpen(true);
  };
  const addToOrderHandler = () => {
    addToOrder(dispatch, { ...product, quantity });
    setIsOpen(false);
  };
  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };

  const previewOrderHandler = () => {
    navigate("/review");
  };

  const plus = () => {
    setQuantity(quantity + 1);
  };
  const minus = () => {
    quantity > 1 && setQuantity(quantity - 1);
  };

  return (
    <Box className={styles.main}>
      <Box className={styles.main}>
        <img src={InBannerAd} alt="InBannerAd" className={styles.large} />
      </Box>
      <Dialog
        width="md"
        open={isOpen}
        onClose={closeHandler}
        className={styles.dialog}
      >
        <CardMedia
          component="img"
          image={`https://self-order-klda.onrender.com/images/${product.image}`}
          alt={product.name}
          className={styles.center}
        />
        <DialogTitle className={styles.center} style={{ fontWeight: "700" }}>
          {product.name}
        </DialogTitle>
        <Box className={[styles.row, styles.center]}>
          <button
            variant="contained"
            color="primary"
            disabled={quantity === 1}
            onClick={minus}
            className={styles.catPrice}
          >
            <FaCircleMinus />
          </button>
          <TextField
            inputProps={{ className: styles.largeInput }}
            InputProps={{
              bar: "false",
              inputProps: {
                className: styles.largeInput,
              },
            }}
            className={styles.largeNumber}
            variant="filled"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button
            variant="contained"
            color="primary"
            onClick={plus}
            className={styles.catPrice}
          >
            <FaPlusCircle />
          </button>
        </Box>
        <Box className={[styles.row, styles.center]}>
          <Typography className={styles.catPrice}>
            Price: ${(product.price * quantity).toFixed(2)}
          </Typography>
        </Box>
        <Box
          className={styles.row}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <button
            onClick={cancelOrRemoveFromOrder}
            variant="contained"
            size="large"
            className={styles.cancelButton}
          >
            {orderItems.find((x) => x.name === product.name)
              ? "Remove From Order"
              : "Cancel"}
          </button>
          <button
            onClick={addToOrderHandler}
            variant="contained"
            size="large"
            className={styles.cancelButton}
          >
            Add To Order
          </button>
        </Box>
      </Dialog>
      <Box className={styles.main}>
        <Grid container>
          <Grid item md={3} className={styles.catBG}>
            <List>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                categories.map((category, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={`https://self-order-klda.onrender.com/images/${category.image}`}
                        alt={category.name}
                        className={styles.media}
                      />
                      <CardContent>
                        <Typography className={styles.catName}>
                          {category.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </ListItemButton>
                ))
              )}
            </List>
          </Grid>
          <Grid item md={9}>
            <Typography
              gutterBottom
              className={styles.title}
              variant="h2"
              component="h2"
            >
              {"Menu"}
              
            </Typography>
            <Grid container spacing={1}>
              {selectedCategory && loadingProducts ? (
                <CircularProgress />
              ) : errorProducts ? (
                <Alert severity="error">{errorProducts}</Alert>
              ) : (
                <>
                {Array.isArray(products) &&
                products.slice(0, 4).map((product, index) => (
                  <Grid item md={6} key={index}>
                    <Card
                      className={styles.card}
                      onClick={() => productClickHandler(product)}
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          alt={product.name}
                          image={`https://self-order-klda.onrender.com/images/${product.image}`}
                          className={styles.media}
                          style={{ margin: "0 auto" }}
                        />
                      </CardActionArea>
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="body2"
                          color="textPrimary"
                          textAlign={"center"}
                          fontWeight="bold"
                          component="p"
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          textAlign={"initial"}
                          component="p"
                          style={{ marginBottom: "1rem" }}
                        >
                          {product.description}
                        </Typography>
                        <Box className={styles.span}>
                          <Typography
                            variant="body2"
                            textAlign={"center"}
                            component="p"
                            className={styles.catPrice}
                            width={2 / 3}
                            style={{ cursor: "pointer" }}
                          >
                            $ {product.price}
                          </Typography>
                          <FaPlusCircle size={20} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              }
              </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box className={[styles.bordered, styles.space]}>
          My Order: {orderType} | Tax: {taxPrice} | Total: ${totalPrice} |
          Items: {itemsCount}
        </Box>
        <Box className={[styles.bordered, styles.space]}>
          <button
            onClick={() => {
              clearOrder(dispatch);
              navigate("/order");
            }}
            variant="contained"
            // size="large"
            className={styles.cancelButton}
          >
            Cancel Order
          </button>
          <button
            onClick={previewOrderHandler}
            variant="contained"
            disabled={orderItems.length === 0}
            className={styles.checkoutButton}
          >
            Checkout
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Order;


 // useEffect(() => {
  //   // Fetch products when selected category changes
  //   if (selectedCategory) {
  //     fetchProducts(selectedCategory);
  //   } else {
  //     Math.floor(Math.random() * 10) % 2 === 0
  //       ? fetchProducts("Most Popular")
  //       : fetchProducts("Desserts");
  //   }
  // }, [selectedCategory]);



  // const fetchProducts = async (categoryName) => {
   
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/products?category=${categoryName}`);
  //     const data = await response.json();
  //     setProducts(data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };