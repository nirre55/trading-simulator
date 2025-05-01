# Functional Specification: Trading Position Simulator (Crypto)

## Objective

Develop a **client-side** web application using **React** (Vite + TypeScript + TailwindCSS) to simulate leveraged cryptocurrency trading strategies. The application will allow users to configure trades, define parameters (leverage, entry price, stop-loss price, fees, drop percentages), and visualize results in a table format. Two variants will be provided: one with manual entry points and one with entry points automatically calculated after the first trade.

## Main Features

### 1. Input Parameters

- **Total balance**: Amount available for investment (e.g., $1000)
- **Leverage**: Leverage factor (e.g., 5x, 10x, 20x, etc.)
- **Entry price**: Initial asset price for each trade
- **Stop-loss price**: User-defined price where the position is liquidated
- **Target gain percentage**: Configurable, default is 100%
- **Fees**:
  - Maker (e.g., 0.1%)
  - Taker (e.g., 0.2%)
  - Funding rate (e.g., 0.01%, configurable)
- **Loss recovery**: Option enabled/disabled (default enabled) to include cumulative losses in the target gain of following trades
- **Symbol**: Crypto asset (e.g., BTC/USDT)
- **Variant 1: Manual entry points**:
  - Number of trades (fixed, user-defined)
  - List of entry prices (one per trade)
- **Variant 2: First entry point, others calculated**:
  - Initial entry price
  - List of drop percentages (e.g., 50%, 25%, user-defined) to calculate liquidation prices

### 2. Validations

- Total balance > 0
- Leverage > 0
- Stop-loss price < initial entry price (variant 2)
- Entry price of each trade > stop-loss price (variant 1)
- Target gain % ≥ 0
- Fees (maker, taker, funding) ≥ 0
- Number of trades ≥ 1 (variant 1)
- Drop % > 0 and < 100% (variant 2)
- Sufficient balance to cover all trades

### 3. Output

- **Per-trade table**:
  - Trade number
  - Symbol
  - Entry price
  - Exit price (to reach target gain)
  - Liquidation price
  - Invested amount
  - Total position value (investment × leverage)
  - Net profit/loss (after fees)
- **Global summary**:
  - Final balance
  - Cumulative losses
  - Total gains (if all trades hit the exit price)

## Logic and Calculations

### 1. Max Amount Per Trade Calculation

- **Variant 1**:  
  `amountPerTrade = totalBalance / numberOfTrades`
- **Variant 2**:
  - Calculate number of trades possible before entry price hits stop-loss price:
    - Trade 1: `liquidationPrice1 = initialEntryPrice × (1 - %drop1/100)`
    - Trade 2: `liquidationPrice2 = liquidationPrice1 × (1 - %drop2/100)`
    - Continue until `liquidationPriceN ≤ stopLossPrice`
    - `numberOfTrades = number of calculated liquidation prices`
  - `amountPerTrade = totalBalance / numberOfTrades`

### 2. Exit Price Calculation

- Position value = `investedAmount × leverage`
- Target gross gain = `positionValue × (targetGain%/100) + cumulativeLosses` (if enabled)
- Total fees = `(investedAmount × makerFee/100) + (grossGain × takerFee/100) + (positionValue × fundingFee/100)`
- Net gain = `grossGain - totalFees`
- Exit price = `entryPrice × (1 + targetGain%/100)`

### 3. Loss Management

- If trade is liquidated:  
  `loss = investedAmount + (investedAmount × makerFee/100)`
- Update:  
  `totalBalance -= loss`  
  `cumulativeLosses += loss`
- Variant 2: Next entry price = previous liquidation price

### 4. Example

- **Parameters**:  
  Balance: $1000, Leverage: 10x, Invested amount: $100, Entry price: $100, Target gain: 100%, Fees: 0.1% maker, 0.2% taker, 0.01% funding, Drop %: [50%, 25%], Stop-loss price: $20, Loss recovery enabled

- **Trade 1**:
  - Position value: $100 × 10 = $1000
  - Gross gain: $1000
  - Fees:  
    `(100 × 0.001) + (1000 × 0.002) + (1000 × 0.0001) = 0.1 + 2 + 0.1 = $2.2`
  - Net gain: `1000 - 2.2 = $997.8`
  - Exit price: `100 × (1 + 1) = $200`
  - Liquidation price: `100 × (1 - 0.5) = $50`

- **Trade 2** (if loss):
  - Entry price: $50
  - Target gain: `1000 + 100 = $1100`
  - Exit price: `50 × (1 + 1100/1000) = $105`
  - Liquidation price: `50 × (1 - 0.25) = $37.5`
  - Stop if next liquidation price (`37.5 × 0.75`) < $20

## User Interface (UI)

### 1. Input Form

- **Common fields**:
  - Total balance (`input number`)
  - Leverage (`select`: 5x, 10x, 20x, etc.)
  - Stop-loss price (`input number`)
  - Target gain % (`input number`, default: 100)
  - Maker/Taker/Funding fees (`input number`, e.g., 0.1, 0.2, 0.01)
  - Loss recovery (`checkbox`, default: checked)
  - Symbol (`input text`, e.g., BTC/USDT)

- **Variant 1**:
  - Number of trades (`input number`)
  - Dynamic list of entry prices (`input number`, one per trade)

- **Variant 2**:
  - Initial entry price (`input number`)
  - Dynamic list of drop %s (`input number`, e.g., 50, 25)

- “Simulate” button (disabled if validations fail)

### 2. Result Display

- **Table** (TailwindCSS):
  - Columns: Trade #, Symbol, Entry price, Exit price, Liquidation price, Invested amount, Position value, Net profit/loss

- **Summary** (TailwindCSS card):
  - Final balance, Cumulative losses, Total gains

### 3. UI Validations

- Show error messages under each field on failure (e.g., “Stop-loss price must be lower than entry price”)
- Disable the “Simulate” button if inputs are invalid

## Tech Stack

- **Framework**: React (Vite + TypeScript)
- **Design**: TailwindCSS
- **Calculations**: Client-side, implemented in TypeScript
- **Data**: No API, based on user inputs
