import React from 'react';
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
import { registerUser } from '../../store/actions/authActions';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Nome é obrigatório'),
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .required('Senha é obrigatória'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
        .required('Confirmação de senha é obrigatória')
    }),
    onSubmit: async (values) => {
      try {
        // Usando a ação assíncrona registerUser do authActions
        const userData = {
          name: values.name,
          email: values.email,
          password: values.password
        };
        
        const resultAction = await dispatch(registerUser(userData)).unwrap();
        // Se chegou aqui, o registro foi bem-sucedido
        navigate('/');
      } catch (error) {
        // O erro já é tratado pelo reducer, não precisamos fazer nada aqui
        console.error('Erro no registro:', error);
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
        Criar Conta
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          fullWidth
          helperText={formik.touched.name && formik.errors.name}
          label="Nome completo"
          margin="normal"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.name}
          variant="outlined"
        />
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
        <TextField
          error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
          fullWidth
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          label="Confirmar senha"
          margin="normal"
          name="confirmPassword"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.confirmPassword}
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
            {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
          </Button>
          
          <Typography
            color="textSecondary"
            variant="body2"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            Já tem uma conta?{' '}
            <Link
              component={RouterLink}
              to="/login"
              variant="subtitle2"
              underline="hover"
            >
              Entrar
            </Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
