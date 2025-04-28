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
  IconButton
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE_URL = 'http://localhost:8080/api';

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

  const getItemImage = (name) => {
    const svgImages = {
      coke: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="#E60000"/>
        <text x="75" y="75" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">COKE</text>
      </svg>`,
      pepsi: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="#004B93"/>
        <text x="75" y="75" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">PEPSI</text>
      </svg>`,
      water: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="#87CEEB"/>
        <text x="75" y="75" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">WATER</text>
      </svg>`,
      chips: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="#FF8C00"/>
        <text x="75" y="75" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">CHIPS</text>
      </svg>`,
      candy: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="#FF1493"/>
        <text x="75" y="75" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">CANDY</text>
      </svg>`
    };
    return `data:image/svg+xml;base64,${btoa(svgImages[name.toLowerCase()])}`;
  };

  if (showStartPage) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h3" gutterBottom>
            Welcome to the Vending Machine
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
            Click below to start shopping
          </Typography>
          <ColorfulButton
            variant="contained"
            size="large"
            onClick={handleStartShopping}
          >
            Start Shopping
          </ColorfulButton>
        </Paper>
      </Container>
    );
  }

  if (showThankYou) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h3" gutterBottom>
            Thank You for Shopping!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Please come again
          </Typography>
        </Paper>
      </Container>
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <BalancePaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Vending Machine
        </Typography>
        <Typography variant="h6" gutterBottom>
          Balance: ${balance.toFixed(2)}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Insert Money Section */}
        <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6" gutterBottom>
            Insert Money
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Amount to insert"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
                disabled={loading}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={4}>
              <ColorfulButton
                fullWidth
                onClick={handleInsertMoney}
                disabled={!amount || parseFloat(amount) <= 0 || loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Insert Money'}
              </ColorfulButton>
            </Grid>
          </Grid>
        </Paper>

        {/* Selected Items Section */}
        {selectedItems.length > 0 && (
          <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" gutterBottom>
              Selected Items
            </Typography>
            <Grid container spacing={2}>
              {selectedItems.map((item) => (
                <Grid item xs={12} key={item.name}>
                  <Paper elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>
                      {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton onClick={() => handleItemRemove(item.name)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="h6" align="right">
                  Total: ${totalPrice.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ColorfulButton
                  fullWidth
                  onClick={handleFinalPurchase}
                  disabled={balance < totalPrice || loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Final Purchase'}
                </ColorfulButton>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Purchase Section */}
        <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6" gutterBottom>
            Available Items
          </Typography>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.name}>
                <ItemCard>
                  <CardMedia
                    component="img"
                    height="140"
                    image={getItemImage(item.name)}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${item.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <ColorfulButton
                      fullWidth
                      onClick={() => handleItemSelect(item)}
                      disabled={item.quantity <= 0 || loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Select Item'}
                    </ColorfulButton>
                  </CardContent>
                </ItemCard>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Reset Transaction Section */}
        <Paper elevation={2} sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6" gutterBottom>
            Reset Transaction
          </Typography>
          <ColorfulButton
            fullWidth
            onClick={handleResetTransaction}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Transaction'}
          </ColorfulButton>
        </Paper>
      </BalancePaper>

      <Dialog
        open={dispensing}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dispensing {dispensedItem?.name}...
          </Typography>
          <CircularProgress size={60} sx={{ mt: 2 }} />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={() => setMessage({ ...message, open: false })}
      >
        <Alert
          onClose={() => setMessage({ ...message, open: false })}
          severity={message.severity}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
