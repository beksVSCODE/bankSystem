/**
 * Data Source Configuration
 * 
 * IMPORTANT: To switch between Supabase and Mock data, update the import line in:
 * - src/hooks/useSupabase.ts
 * 
 * Change from:
 *   import { accountService, transactionService, notificationService, userService } from '@/services/supabaseService';
 * 
 * To:
 *   import { accountService, transactionService, notificationService, userService } from '@/services/mockService';
 */

// Current data source status
const DATA_SOURCE = 'mock'; // 'mock' | 'supabase'

export const getDataSourceConfig = () => {
    return {
        source: DATA_SOURCE,
        isMock: DATA_SOURCE === 'mock',
        isSupabase: DATA_SOURCE === 'supabase',
        description: DATA_SOURCE === 'mock' 
            ? 'Using local mock data (in-memory storage)'
            : 'Using Supabase remote database'
    };
};

// Helper function to switch data source
export const getSwitchInstructions = () => {
    return `
╔════════════════════════════════════════════════════════════════╗
║                  Data Source Configuration                     ║
╚════════════════════════════════════════════════════════════════╝

To switch between Supabase and Mock data:

📝 Step 1: Open src/hooks/useSupabase.ts

📝 Step 2: Look for the import line (around line 2-3)

🔴 For Mock Data (Current):
   import { accountService, transactionService, notificationService, userService } 
     from '@/services/mockService';

🔵 For Supabase:
   import { accountService, transactionService, notificationService, userService } 
     from '@/services/supabaseService';

📝 Step 3: Save the file and restart your dev server (npm run dev)

✅ Current Mode: ${DATA_SOURCE}

🔧 Other Mock Data Sources:
   - src/mock/authStore.ts - Authentication (always mock)
   - src/mock/supabaseFinancialStore.ts - Financial operations store
   - src/mock/data.ts - Sample data (User, Accounts, Cards, Transactions, etc.)
   - src/services/mockService.ts - Service layer for mock API calls
    `;
};

console.log(getSwitchInstructions());
