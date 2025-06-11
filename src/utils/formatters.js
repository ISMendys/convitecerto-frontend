/**
 * Formata uma string de dígitos de telefone no padrão brasileiro.
 * Ex: "48999998888" -> "(48) 99999-8888"
 * Ex: "1140042022" -> "(11) 4004-2022"
 * @param {string | null | undefined} numero - Apenas os dígitos do telefone.
 * @returns {string} O número formatado ou a string original se não for um formato conhecido.
 */
export const formatarTelefone = (numero) => {
    if (!numero || typeof numero !== 'string') return '';
  
    // Garante que só temos dígitos
    const numeros = numero.replace(/\D/g, '');
  
    if (numeros.length === 11) {
      // Celular com 9º dígito: (XX) XXXXX-XXXX
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  
    if (numeros.length === 10) {
      // Fixo ou celular antigo: (XX) XXXX-XXXX
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
  
    // Retorna o número original se não se encaixar nos padrões
    return numero;
  };