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
  CssBaseline,
  Badge
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const API_BASE_URL = 'http://localhost:8080/api';

// Enhanced dark theme with better contrast
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6a11cb',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#2575fc',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#b0b0b0'
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
      background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 0 10px rgba(106, 17, 203, 0.3)'
    },
    h5: {
      fontWeight: 500,
      color: '#e0e0e0'
    },
    h6: {
      fontWeight: 600,
      color: '#ffffff'
    }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }
      }
    }
  }
});

const ColorfulButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
  border: 0,
  borderRadius: 16,
  color: 'white',
  height: 48,
  padding: '0 30px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(106, 17, 203, 0.4)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(106, 17, 203, 0.5)',
    background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 80%)',
  },
  '&:disabled': {
    background: theme.palette.grey[800],
    color: theme.palette.grey[500],
    transform: 'none',
    boxShadow: 'none',
  },
}));

const ItemCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: 'auto',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
    borderColor: theme.palette.primary.main,
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)'
    }
  },
}));

const BalancePaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
  color: 'white',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 150, 255, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 65%, rgba(255,255,255,0.15) 100%)',
  },
  '& .MuiTypography-h6': {
    opacity: 0.9,
    fontWeight: 500
  },
  '& .MuiTypography-h4': {
    fontWeight: 700,
    fontSize: '2.5rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  }
}));

// High-quality product images
const productImages = {
  coke: '../photos/coke.png',
  pepsi: '../photos/pepsi.png',
  water: '../photos/water.png', 
  chips: '../photos/chips.png',
  candy: '../photos/mnm.png', 
  sprite: '../photos/sprite.png',
  fanta: '../photos/fanta.png',
  mountain_dew: '../photos/mountain.png',
  doritos: '../photos/doritos.png',
  snickers: '../photos/snickers.png',
  twix: '../photos/twix.png',
  kitkat: '../photos/kitkat.png'
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
            background: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)',
          }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              p: 8, 
              maxWidth: 800, 
              width: '90%',
              textAlign: 'center',
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              animation: 'fadeIn 0.6s ease',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ mb: 4, fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
              Premium Vending Machine
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ 
              color: '#b0b0b0', 
              mb: 6,
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}>
              Your favorite snacks and drinks at your fingertips
            </Typography>
            <ColorfulButton
              variant="contained"
              size="large"
              onClick={handleStartShopping}
              sx={{ 
                fontSize: '1.2rem', 
                padding: '15px 50px',
                mt: 2,
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.03)'
                }
              }}
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
            background: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)',
          }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              p: 8, 
              maxWidth: 800, 
              width: '90%',
              textAlign: 'center',
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px'
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ 
              mb: 4,
              fontSize: { xs: '2.5rem', sm: '3.5rem' }
            }}>
              Thank You!
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ 
              color: '#b0b0b0',
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}>
              Your items are being dispensed. Enjoy your purchase!
            </Typography>
            <Box sx={{ mt: 4 }}>
              <CircularProgress size={60} thickness={4} sx={{ color: '#6a11cb' }} />
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  if (loading && items.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          background: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)'
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={80} thickness={4} sx={{ color: '#6a11cb' }} />
          <Typography variant="h6" sx={{ mt: 3, color: 'rgba(255,255,255,0.7)' }}>
            Loading vending machine...
          </Typography>
        </Box>
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
            <Paper elevation={3} sx={{ 
              p: 3, 
              mb: 3, 
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
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
                    label="Insert Money ($)"
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                      sx: {
                        color: '#ffffff',
                        fontSize: '1.1rem',
                        '& input': {
                          textAlign: 'center'
                        }
                      },
                      inputProps: {
                        min: 0,
                        step: 0.01
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6a11cb',
                          boxShadow: '0 0 0 2px rgba(106, 17, 203, 0.3)'
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#6a11cb'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <ColorfulButton
                      fullWidth
                      onClick={handleInsertMoney}
                      disabled={loading || !amount}
                      sx={{
                        fontSize: '0.9rem',
                        background: 'linear-gradient(45deg, #00b4db 0%, #0083b0 100%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #00b4db 0%, #0083b0 80%)',
                          transform: 'translateY(-3px)'
                        },
                        '&:disabled': {
                          background: 'rgba(0, 180, 219, 0.2)',
                          color: 'rgba(255, 255, 255, 0.5)',
                          transform: 'none',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      Insert Money
                    </ColorfulButton>
                    <ColorfulButton
                      fullWidth
                      onClick={handleResetTransaction}
                      disabled={loading || balance === 0}
                      sx={{ 
                        background: 'linear-gradient(45deg, #ff416c 0%, #ff4b2b 100%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff416c 0%, #ff4b2b 80%)',
                          transform: 'translateY(-3px)'
                        },
                        '&:disabled': {
                          background: 'rgba(255, 65, 108, 0.2)',
                          color: 'rgba(255, 255, 255, 0.5)',
                          transform: 'none',
                          boxShadow: 'none'
                        },
                        fontSize: '0.9rem'
                      }}
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
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mb: 2,
              position: 'sticky',
              top: 20,
              zIndex: 1
            }}>
              <Badge 
                badgeContent={selectedItems.reduce((sum, item) => sum + item.quantity, 0)} 
                color="primary"
                overlap="circular"
                sx={{ 
                  mr: 2,
                  '& .MuiBadge-badge': {
                    fontSize: '0.9rem',
                    height: 24,
                    minWidth: 24,
                    padding: '0 4px',
                    transform: 'scale(1) translate(50%, -50%)'
                  }
                }}
              >
                <ShoppingCartIcon sx={{ 
                  fontSize: 36,
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#6a11cb',
                    transform: 'scale(1.1)'
                  }
                }} />
              </Badge>
            </Box>
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
                        sx={{ 
                          objectFit: 'cover',
                          height: '200px',
                          width: '100%',
                          transition: 'transform 0.5s ease',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ 
                          fontWeight: 600,
                          color: '#ffffff',
                          fontSize: '1.2rem',
                          mb: 1
                        }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#b0b0b0', 
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <span style={{ color: '#ffffff', fontWeight: 500 }}>${item.price.toFixed(2)}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: item.quantity > 0 ? '#4caf50' : '#f44336',
                          fontWeight: 500,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <ColorfulButton
                            fullWidth
                            onClick={() => handleItemSelect(item)}
                            disabled={item.quantity <= 0 || loading}
                            sx={{
                              fontSize: '0.8rem',
                              padding: '8px 16px',
                              height: 'auto',
                              background: item.quantity > 0 
                                ? 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)'
                                : 'rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                background: item.quantity > 0 
                                  ? 'linear-gradient(45deg, #6a11cb 0%, #2575fc 80%)'
                                  : 'rgba(255, 255, 255, 0.1)',
                                transform: item.quantity > 0 ? 'translateY(-3px)' : 'none'
                              },
                              '&:disabled': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.5)',
                                transform: 'none',
                                boxShadow: 'none'
                              }
                            }}
                          >
                            {item.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
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
              <Paper elevation={3} sx={{ 
                p: 3, 
                mt: 3, 
                background: 'rgba(26, 26, 26, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                animation: 'slideUp 0.3s ease',
                '@keyframes slideUp': {
                  from: { transform: 'translateY(20px)', opacity: 0 },
                  to: { transform: 'translateY(0)', opacity: 1 }
                }
              }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  mb: 3,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <ShoppingCartIcon sx={{ color: '#6a11cb' }} />
                  Your Shopping Cart
                </Typography>
                <Grid container spacing={2}>
                  {selectedItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.name}>
                      <Paper sx={{ 
                        p: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.12)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img 
                            src={productImages[item.name.toLowerCase().replace(/\s+/g, '_')]} 
                            alt={item.name}
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              objectFit: 'cover',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              padding: '2px'
                            }}
                          />
                          <Box>
                            <Typography sx={{ 
                              fontWeight: 500,
                              color: '#ffffff'
                            }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '0.8rem',
                              color: '#b0b0b0'
                            }}>
                              Qty: {item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography sx={{ 
                            fontWeight: 600,
                            color: '#ffffff',
                            fontSize: '1.1rem'
                          }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton 
                            onClick={() => handleItemRemove(item.name)} 
                            color="error"
                            sx={{
                              '&:hover': {
                                background: 'rgba(255, 0, 0, 0.2)',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ 
                  mt: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  pt: 3,
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <span style={{ color: '#b0b0b0', fontSize: '1rem' }}>Total:</span> ${totalPrice.toFixed(2)}
                  </Typography>
                  <ColorfulButton
                    onClick={handleFinalPurchase}
                    disabled={loading || totalPrice > balance}
                    sx={{ 
                      background: 'linear-gradient(45deg, #4CAF50 0%, #2E7D32 100%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4CAF50 0%, #2E7D32 80%)',
                        transform: 'translateY(-3px)'
                      },
                      '&:disabled': {
                        background: 'rgba(76, 175, 80, 0.2)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        transform: 'none',
                        boxShadow: 'none'
                      },
                      fontSize: '0.9rem',
                      padding: '12px 24px'
                    }}
                  >
                    Complete Purchase
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
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          TransitionComponent={Fade}
        >
          <Alert 
            severity={message.severity} 
            sx={{ 
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              alignItems: 'center',
              fontSize: '1rem',
              fontWeight: 500,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            variant="filled"
          >
            {message.text}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;