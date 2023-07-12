import axios from 'axios';

export const PlayerService = {
    async getPlayerData() {
        try {
            const response = await axios.get('<API_ENDPOINT>');
            return response.data;
        } catch (error) {
            console.error('Error fetching player:', error);
            return [];
        }
    },

    async getPlayerMini() {
        try {
            const playerData = await this.getPlayerData();
            return playerData.slice(0, 5);
        } catch (error) {
            console.error('Error fetching mini players:', error);
            return [];
        }
    },

    async getPlayerSmall() {
        try {
            const playerData = await this.getPlayerData();
            return playerData.slice(0, 10);
        } catch (error) {
            console.error('Error fetching small products:', error);
            return [];
        }
    },

    async getPlayer() {
        try {
            return await this.getPlayerData();
        } catch (error) {
            console.error('Error fetching player:', error);
            return [];
        }
    }
};
