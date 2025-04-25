import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { loginUser } from '../../store/actions/authActions';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .required('Senha é obrigatória')
    }),
    onSubmit: async (values) => {
      try {
        // Usando a ação assíncrona loginUser do authActions
        const resultAction = await dispatch(loginUser(values)).unwrap();
        // Se chegou aqui, o login foi bem-sucedido
        navigate('/');
      } catch (error) {
        // O erro já é tratado pelo reducer, não precisamos fazer nada aqui
        console.error('Erro no login:', error);
      }
    }
  });

  return (
    <Box>
      <Typography
        color="textPrimary"
        variant="h4"
        sx={{ mb: 2 }}
      >
        Entrar
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <TextField
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label="Senha"
          margin="normal"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
          variant="outlined"
        />
        
        <Box sx={{ mt: 2 }}>
          <Button
            color="primary"
            disabled={loading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
          
          <Typography
            color="textSecondary"
            variant="body2"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            Não tem uma conta?{' '}
            <Link
              component={RouterLink}
              to="/register"
              variant="subtitle2"
              underline="hover"
            >
              Cadastre-se
            </Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
