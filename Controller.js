const BLUESALES_API = {
    login: "kolodiazhnyi.stepan@hd-school.ru",
    pass: "12345678"
}
const UTM_KEYS = [
    "responsible",
    "product",
    "page"
]
const axios = require('axios');

class Controller {
    update = async (req, res) => {
        const { tags_arr, vk_id } = req.body;

        // Проверка на наличие необходимых данных
        if (!Array.isArray(tags_arr) || tags_arr.length === 0 || !vk_id) {
            console.log('Invalid data structure');
            return res.status(400).json({ error: 'Invalid data structure' });
        }

        try {
            console.log(`Received VK ID: ${vk_id}`);
            const lastTag = tags_arr[tags_arr.length - 1];
            console.log('Last tag:', lastTag);

            // Вызов функции для получения BlueSales ID
            await this.getBlueSalesId(vk_id);

            return res.status(200).json({ message: 'Webhook received successfully' });
        } catch (error) {
            console.error('Error processing webhook:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getBlueSalesId(vk_id) {
        const vkIds = { "vkIds": [Number(vk_id)] };

        try {
            const response = await axios.post(
                `https://bluesales.ru/app/Customers/WebServer.aspx?login=${BLUESALES_API.login}&password=${BLUESALES_API.pass}&command=customers.get`, 
                vkIds
            );

            const customerId = response.data?.customers?.[0]?.id;
            const tags = response.data?.customers?.[0]?.tags;
            if (customerId) {
                console.log(`BlueSales ID: ${customerId}`);
                this.updateCFBlueSalesTag(customerId, tags)
            } else {
                console.error('Customer ID not found in the response.');
            }
        } catch (error) {
            console.error('Error fetching BlueSales ID:', error);
        }
    }


    async updateCFBlueSalesTag(id, tags) {
        if (tags){
            tags.push({id: 321538})
        } else{
            tags = [{id: 321538}]
        }
        
        const update = {
            "id": id,
            "tags": tags
        };

        try {
            const response = await axios.post(
                `https://bluesales.ru/app/Customers/WebServer.aspx?login=${BLUESALES_API.login}&password=${BLUESALES_API.pass}&command=customers.update`, 
                update
            );

            console.log(`Status: ${response.status}`);
            //console.log('Body:', response.data);
        } catch (error) {
            console.error('Error updating BlueSales source:', error);
        }
    }
}

module.exports = new Controller();

