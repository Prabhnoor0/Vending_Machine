import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Snackbar, 
  Alert, 
  CircularProgress, 
  Box,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Grow,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE_URL = 'http://localhost:8080/api';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const ColorfulButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
  },
}));

const ItemCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: 'auto',
  transition: 'transform 0.2s',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const BalancePaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

// Real product images
const productImages = {
  coke: 'https://www.coca-cola.com/content/dam/onexp/us/en/brands/coca-cola/original-coca-cola/product-images/original-coca-cola-bottle.jpg',
  pepsi: 'https://www.pepsi.com/en-us/uploads/images/can-pdp.png',
  water: 'https://www.aquafina.com/content/dam/onexp/us/en/brands/aquafina/product-images/aquafina-bottle.png',
  chips: 'https://www.lays.com/sites/lays.com/files/2021-02/lays-classic.png',
  candy: 'https://www.mms.com/content/dam/mms/en-us/images/products/mms-peanut-butter.png',
  sprite: 'https://www.sprite.com/content/dam/onexp/us/en/brands/sprite/product-images/sprite-bottle.png',
  fanta: 'https://www.fanta.com/content/dam/onexp/us/en/brands/fanta/product-images/fanta-orange-bottle.png',
  mountain_dew: 'https://www.mountaindew.com/content/dam/onexp/us/en/brands/mountain-dew/product-images/mountain-dew-bottle.png',
  doritos: 'https://www.doritos.com/content/dam/onexp/us/en/brands/doritos/product-images/doritos-nacho-cheese.png',
  snickers: 'https://www.snickers.com/content/dam/onexp/us/en/brands/snickers/product-images/snickers-bar.png',
  twix: 'https://www.twix.com/content/dam/onexp/us/en/brands/twix/product-images/twix-bar.png',
  kitkat: 'https://www.kitkat.com/content/dam/onexp/us/en/brands/kit-kat/product-images/kit-kat-bar.png'
};

function App() {
  const [items, setItems] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dispensing, setDispensing] = useState(false);
  const [dispensedItem, setDispensedItem] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/items`);
      setItems(response.data);
    } catch (error) {
      setError('Failed to fetch items. Please try again later.');
      showMessage('Error fetching items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertMoney = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/insert-money`, {
        amount: parseFloat(amount)
      });
      setBalance(response.data.balance);
      setAmount('');
      showMessage('Money inserted successfully', 'success');
    } catch (error) {
      setError(error.response?.data?.error || 'Error inserting money');
      showMessage(error.response?.data?.error || 'Error inserting money', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    if (item.quantity <= 0) return;
    
    const newSelectedItems = [...selectedItems];
    const existingItemIndex = newSelectedItems.findIndex(i => i.name === item.name);
    
    if (existingItemIndex >= 0) {
      newSelectedItems[existingItemIndex].quantity += 1;
    } else {
      newSelectedItems.push({ ...item, quantity: 1 });
    }
    
    setSelectedItems(newSelectedItems);
    setTotalPrice(newSelectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  };

  const handleItemRemove = (itemName) => {
    const newSelectedItems = selectedItems.filter(item => item.name !== itemName);
    setSelectedItems(newSelectedItems);
    setTotalPrice(newSelectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  };

  const handleFinalPurchase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Process each selected item
      for (const item of selectedItems) {
        const response = await axios.post(`${API_BASE_URL}/purchase`, {
          item: item.name,
          quantity: item.quantity
        });
        setBalance(response.data.balance);
      }
      
      setDispensing(true);
      setTimeout(() => {
        setDispensing(false);
        setShowThankYou(true);
        setTimeout(() => {
          setShowThankYou(false);
          setShowStartPage(true);
          setSelectedItems([]);
          setTotalPrice(0);
        }, 7000);
      }, 5000);
      
      await fetchItems();
      showMessage('Purchase successful', 'success');
    } catch (error) {
      setError(error.response?.data?.error || 'Error purchasing items');
      showMessage(error.response?.data?.error || 'Error purchasing items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/return-change`);
      setBalance(0);
      setAmount('');
      showMessage(`Transaction reset. Change returned: $${response.data.change.toFixed(2)}`, 'success');
    } catch (error) {
      setError('Error resetting transaction');
      showMessage('Error resetting transaction', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartShopping = () => {
    setShowStartPage(false);
  };

  const showMessage = (text, severity) => {
    setMessage({ open: true, text, severity });
  };

  if (showStartPage) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
          }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              p: 8, 
              maxWidth: 800, 
              width: '90%',
              textAlign: 'center',
              background: 'rgba(30, 30, 30, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ color: '#fff', mb: 4 }}>
              Welcome to the Vending Machine
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: '#aaa', mb: 6 }}>
              Click below to start shopping
            </Typography>
            <ColorfulButton
              variant="contained"
              size="large"
              onClick={handleStartShopping}
              sx={{ fontSize: '1.2rem', padding: '12px 40px' }}
            >
              Start Shopping
            </ColorfulButton>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  if (showThankYou) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
          }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              p: 8, 
              maxWidth: 800, 
              width: '90%',
              textAlign: 'center',
              background: 'rgba(30, 30, 30, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ color: '#fff', mb: 4 }}>
              Thank You for Shopping!
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: '#aaa' }}>
              Please come again
            </Typography>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  if (loading && items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Top Section - Money and Purchase Controls */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <BalancePaper elevation={3}>
                    <Typography variant="h6">Current Balance</Typography>
                    <Typography variant="h4">${balance.toFixed(2)}</Typography>
                  </BalancePaper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Insert Money"
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <ColorfulButton
                      fullWidth
                      onClick={handleInsertMoney}
                      disabled={loading || !amount}
                    >
                      Insert Money
                    </ColorfulButton>
                    <ColorfulButton
                      fullWidth
                      onClick={handleResetTransaction}
                      disabled={loading || balance === 0}
                      sx={{ background: 'linear-gradient(45deg, #FF5252 30%, #FF1744 90%)' }}
                    >
                      Return Change
                    </ColorfulButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Items Grid */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
                  <Grow in={true} timeout={1000}>
                    <ItemCard>
                      <CardMedia
                        component="img"
                        height="200"
                        image={productImages[item.name.toLowerCase().replace(/\s+/g, '_')] || 'https://via.placeholder.com/200'}
                        alt={item.name}
                        sx={{ objectFit: 'contain', p: 2 }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${item.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available: {item.quantity}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <ColorfulButton
                            fullWidth
                            onClick={() => handleItemSelect(item)}
                            disabled={item.quantity <= 0 || loading}
                          >
                            Add to Cart
                          </ColorfulButton>
                        </Box>
                      </CardContent>
                    </ItemCard>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Selected Items and Purchase Button */}
          {selectedItems.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, mt: 3, background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)' }}>
                <Typography variant="h6" gutterBottom>
                  Selected Items
                </Typography>
                <Grid container spacing={2}>
                  {selectedItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.name}>
                      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>{item.name} x {item.quantity}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 2 }}>${(item.price * item.quantity).toFixed(2)}</Typography>
                          <IconButton onClick={() => handleItemRemove(item.name)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Total: ${totalPrice.toFixed(2)}
                  </Typography>
                  <ColorfulButton
                    onClick={handleFinalPurchase}
                    disabled={loading || totalPrice > balance}
                    sx={{ background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)' }}
                  >
                    Purchase
                  </ColorfulButton>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Snackbar
          open={message.open}
          autoHideDuration={4000}
          onClose={() => setMessage({ ...message, open: false })}
        >
          <Alert severity={message.severity} sx={{ width: '100%' }}>
            {message.text}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
