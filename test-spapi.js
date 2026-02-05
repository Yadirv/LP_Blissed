// test-spapi.js - Script de prueba para Amazon SP-API
// Valida conexión y credenciales con sandbox

require('dotenv').config();
const SellingPartner = require('amazon-sp-api');
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(emoji, color, message) {
  console.log(`${emoji} ${color}${message}${colors.reset}`);
}

async function testSPAPI() {
  console.log('\n' + '='.repeat(60));
  log('🧪', colors.bold + colors.cyan, 'TEST DE AMAZON SP-API - BLISSED SKIN');
  console.log('='.repeat(60) + '\n');

  // Verificar variables de entorno
  log('📋', colors.yellow, 'Verificando variables de entorno...');
  
  const requiredVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'IAM_ROLE_ARN',
    'LWA_CLIENT_ID',
    'LWA_CLIENT_SECRET',
    'REFRESH_TOKEN',
    'MARKETPLACE_ID'
  ];

  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    log('❌', colors.red, `Variables faltantes: ${missing.join(', ')}`);
    log('💡', colors.yellow, 'Verifica que el archivo .env esté en la raíz del proyecto');
    process.exit(1);
  }

  log('✅', colors.green, 'Todas las variables de entorno están configuradas\n');

  try {
    // Paso 1: Obtener credenciales temporales de AWS STS
    log('1️⃣', colors.cyan, 'Obteniendo credenciales temporales de AWS STS...');
    
    const stsClient = new STSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const assumeRoleCommand = new AssumeRoleCommand({
      RoleArn: process.env.IAM_ROLE_ARN,
      RoleSessionName: 'blissed-skin-sp-api-test',
      DurationSeconds: 3600
    });

    const stsResponse = await stsClient.send(assumeRoleCommand);
    
    log('✅', colors.green, 'Credenciales temporales obtenidas');
    console.log(`   ${colors.cyan}Access Key:${colors.reset} ${stsResponse.Credentials.AccessKeyId}`);
    console.log(`   ${colors.cyan}Expira:${colors.reset} ${stsResponse.Credentials.Expiration.toLocaleString('es-ES')}\n`);

    // Paso 2: Inicializar cliente SP-API
    log('2️⃣', colors.cyan, 'Inicializando cliente de SP-API...');
    
    const useSandbox = process.env.USE_SPAPI_SANDBOX !== 'false';
    
    const spClient = new SellingPartner({
      region: 'na', // North America (usa 'eu' para Europa, 'fe' para Far East)
      refresh_token: process.env.REFRESH_TOKEN,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.LWA_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.LWA_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: stsResponse.Credentials.AccessKeyId,
        AWS_SECRET_ACCESS_KEY: stsResponse.Credentials.SecretAccessKey,
        AWS_SESSION_TOKEN: stsResponse.Credentials.SessionToken
      },
      options: {
        use_sandbox: useSandbox,
        debug_log: false
      }
    });

    const mode = useSandbox ? 'SANDBOX' : 'PRODUCCIÓN';
    log('✅', colors.green, `Cliente SP-API inicializado en modo ${mode}\n`);

    // Paso 3: Test - Orders API (la más básica y confiable en sandbox)
    log('3️⃣', colors.cyan, 'Probando Orders API...');
    
    console.log(`   ${colors.yellow}Marketplace:${colors.reset} ${process.env.MARKETPLACE_ID} (USA)`);
    console.log(`   ${colors.yellow}Modo:${colors.reset} ${useSandbox ? 'SANDBOX' : 'PRODUCCIÓN'}\n`);

    const ordersResponse = await spClient.callAPI({
      operation: 'getOrders',
      endpoint: 'orders',
      query: {
        MarketplaceIds: process.env.MARKETPLACE_ID,
        CreatedAfter: '2024-01-01T00:00:00Z'
      }
    });

    log('✅', colors.green, 'Respuesta recibida exitosamente!\n');

    // Mostrar información de órdenes
    console.log('📦 ' + colors.bold + 'RESPUESTA DE ÓRDENES:' + colors.reset);
    console.log('─'.repeat(60));
    console.log(JSON.stringify(ordersResponse, null, 2));

    console.log('─'.repeat(60) + '\n');

    // Resumen final
    console.log('='.repeat(60));
    log('🎉', colors.bold + colors.green, 'TEST COMPLETADO EXITOSAMENTE!');
    console.log('='.repeat(60) + '\n');

    console.log('📋 ' + colors.bold + 'PRÓXIMOS PASOS:' + colors.reset);
    console.log('   1. Configurar Netlify Functions para exponer SP-API');
    console.log('   2. Crear cliente JavaScript para el frontend');
    console.log('   3. Integrar precios dinámicos en productos');
    console.log('   4. Cambiar a producción (USE_SPAPI_SANDBOX=false)\n');

    log('💡', colors.cyan, 'Todo está listo para continuar con la integración!');
    console.log('');

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    log('❌', colors.red, 'ERROR EN EL TEST');
    console.log('='.repeat(60) + '\n');

    console.error(`${colors.red}Mensaje:${colors.reset} ${error.message}\n`);

    if (error.code) {
      console.error(`${colors.yellow}Código:${colors.reset} ${error.code}`);
    }

    if (error.response) {
      console.error(`${colors.yellow}Response status:${colors.reset} ${error.response.status}`);
      console.error(`${colors.yellow}Response data:${colors.reset}`);
      console.error(JSON.stringify(error.response.data, null, 2));
    }

    console.log('\n🔍 ' + colors.bold + 'DEBUGGING:' + colors.reset);
    console.log('   • Verificar credenciales en .env');
    console.log('   • Verificar IAM Role ARN correcto');
    console.log('   • Verificar LWA Client ID y Secret');
    console.log('   • Verificar Refresh Token no expirado');
    console.log('   • Verificar permisos en Seller Central\n');

    console.error('Error completo:');
    console.error(error);

    process.exit(1);
  }
}

// Ejecutar test
testSPAPI();
