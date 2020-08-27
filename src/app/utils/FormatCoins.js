import {
    APP_NAME,
    LIQUID_TOKEN,
    LIQUID_TOKEN_UPPERCASE,
    DEBT_TOKEN,
    DEBT_TOKEN_SHORT,
    CURRENCY_SIGN,
    VESTING_TOKEN,
} from 'app/client_config';

// TODO add comments and explanations
// TODO change name to formatCoinTypes?
// TODO make use of DEBT_TICKER etc defined in config/clietn_config
export function formatCoins(string) {
    // return null or undefined if string is not provided
    if (!string) return string;
    // TODO use .to:owerCase() ? for string normalisation
    string = string
        .replace('HBD', DEBT_TOKEN_SHORT)
        .replace('HD', DEBT_TOKEN_SHORT)
        .replace('Hive Power', VESTING_TOKEN)
        .replace('HIVE POWER', VESTING_TOKEN)
        .replace('Hive', LIQUID_TOKEN)
        .replace('HIVE', LIQUID_TOKEN_UPPERCASE)
        .replace('$', CURRENCY_SIGN);
    return string;
}
