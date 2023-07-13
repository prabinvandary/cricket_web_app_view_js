import axios from "axios";

export const PlayerService = {
    async getPlayerData() {
        try {
            const response = await axios.get('http://localhost:5050/webapp/player');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching players:', error);
            throw error;
        }

    },
    async savePlayerData(player) {
        try {
            console.log(JSON.stringify(player))
            const response =
                await axios.post('http://localhost:5050/webapp/player',
                    JSON.stringify(player), {
                        headers: {'Content-Type': 'application/json'}
                    });
            return response.data;
        } catch (error) {
            console.error('Error saving players:', error);
            throw error;
        }
    },
    async deletePlayer(id) {
        console.log(id);
        try {
            const config = {
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Methods': 'DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Content-Type': 'null'

                }
            };

            const response =
                await axios.delete(`http://localhost:5050/webapp/player/${id}`,config);
            return response.data;
        } catch (error) {
            console.error('Error deleting players:', error);
            throw error;
        }
    },

    getPlayerMiniData() {
        return Promise.resolve(this.getPlayerData().slice(0, 5));
    },

    getPlayersSmall() {
        return Promise.resolve(this.getPlayerData().slice(0, 10));
    },

    getPlayer() {
        return Promise.resolve(this.getPlayerData());
    },
    savePlayer(player) {
        return Promise.resolve(this.savePlayerData(player));
    }

};

