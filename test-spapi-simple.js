// test-spapi-simple.js - Test simplificado de autenticación
require('dotenv').config();
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');

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

async function testAuth() {
  console.log('\n' + '='.repeat(60));
  log('🧪', colors.bold + colors.cyan, 'TEST DE AUTENTICACIÓN SP-API - BLISSED SKIN');
  console.log('='.repeat(60) + '\n');

  try {
    // Test 1: AWS STS AssumeRole
    log('1️⃣', colors.cyan, 'Test: AWS STS AssumeRole...');
    
    const stsClient = new STSClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const assumeRoleCommand = new AssumeRoleCommand({
      RoleArn: process.env.IAM_ROLE_ARN,
      RoleSessionName: 'blissed-skin-test',
      DurationSeconds: 3600
    });

    const stsResponse = await stsClient.send(assumeRoleCommand);
    
    log('✅', colors.green, 'AWS STS AssumeRole EXITOSO');
    console.log(`   ${colors.cyan}Temporal Access Key:${colors.reset} ${stsResponse.Credentials.AccessKeyId}`);
    console.log(`   ${colors.cyan}Expira:${colors.reset} ${stsResponse.Credentials.Expiration.toLocaleString('es-ES')}\n`);

    // Test 2: LWA Access Token
    log('2️⃣', colors.cyan, 'Test: LWA Access Token...');
    
    const lwaResponse = await fetch('https://api.amazon.com/auth/o2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.REFRESH_TOKEN,
        client_id: process.env.LWA_CLIENT_ID,
        client_secret: process.env.LWA_CLIENT_SECRET
      })
    });

    if (!lwaResponse.ok) {
      const errorText = await lwaResponse.text();
      throw new Error(`LWA Token error: ${lwaResponse.status} - ${errorText}`);
    }

    const lwaData = await lwaResponse.json();
    
    log('✅', colors.green, 'LWA Access Token EXITOSO');
    console.log(`   ${colors.cyan}Access Token (primeros 20 chars):${colors.reset} ${lwaData.access_token.substring(0, 20)}...`);
    console.log(`   ${colors.cyan}Token Type:${colors.reset} ${lwaData.token_type}`);
    console.log(`   ${colors.cyan}Expira en:${colors.reset} ${lwaData.expires_in} segundos (${lwaData.expires_in / 60} minutos)\n`);

    // Resumen
    console.log('='.repeat(60));
    log('🎉', colors.bold + colors.green, 'TODAS LAS PRUEBAS DE AUTENTICACIÓN PASARON');
    console.log('='.repeat(60) + '\n');

    console.log('✅ ' + colors.bold + 'CREDENCIALES VERIFICADAS:' + colors.reset);
    console.log('   • AWS IAM User y Role configurados correctamente');
    console.log('   • STS AssumeRole funcionando');
    console.log('   • LWA Client ID y Secret válidos');
    console.log('   • Refresh Token válido y funcionando\n');

    console.log('📋 ' + colors.bold + 'PRÓXIMOS PASOS:' + colors.reset);
    console.log('   1. Actualizar SDK de amazon-sp-api a versión 3.x');
    console.log('   2. Configurar Netlify Functions');
    console.log('   3. Crear cliente JavaScript para frontend');
    console.log('   4. Integrar precios dinámicos\n');

    log('💡', colors.cyan, 'La autenticación está lista para usar SP-API!');
    console.log('');

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    log('❌', colors.red, 'ERROR EN TEST DE AUTENTICACIÓN');
    console.log('='.repeat(60) + '\n');

    console.error(`${colors.red}Mensaje:${colors.reset} ${error.message}\n`);

    if (error.response) {
      console.error(`${colors.yellow}Response:${colors.reset}`);
      console.error(JSON.stringify(error.response.data, null, 2));
    }

    console.error('\nError completo:');
    console.error(error);

    process.exit(1);
  }
}

testAuth();
