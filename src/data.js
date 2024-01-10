const dummyData = {
    "token_id": 9000,
    "name": "Burned Ape #9000",
    "description": "This is one of 10,000 Apes created under one of four Guilds. The Creator brought us the Apes to help the Bulls reach their potential. This Ape is yours and you will have the ability to customize and design your Ape through dynamic trait mechanics. Welcome to the Bulls & Apes Project!",
    "is_alive": true,
    "attributes": [
        {
            "trait_type": "Necklace",
            "value": "M-Zulu beads",
            "is_og": true,
            "occurrences": "3.95",
            "count": 394
        },
        {
            "trait_type": "Gender",
            "value": "Male",
            "is_og": true,
            "occurrences": "49.86",
            "count": 4976
        },
        {
            "trait_type": "Ear rings",
            "value": "U-Big Hoop",
            "is_og": true,
            "occurrences": "7.88",
            "count": 786
        },
        {
            "trait_type": "Expression",
            "value": "U-Happy 1",
            "is_og": true,
            "occurrences": "12.50",
            "count": 1247
        },
        {
            "trait_type": "Front Addon",
            "value": "U-Metal Rod",
            "is_og": true,
            "occurrences": "8.93",
            "count": 891
        },
        {
            "trait_type": "Guild",
            "value": "East",
            "is_og": true,
            "occurrences": "24.94",
            "count": 2489
        },
        {
            "trait_type": "Body",
            "value": "U-Graphite Gray F",
            "is_og": true,
            "occurrences": "32.75",
            "count": 3268
        },
        {
            "trait_type": "Eyes",
            "value": "U-Coal",
            "is_og": true,
            "occurrences": "33.10",
            "count": 3303
        },
        {
            "trait_type": "Body Type",
            "value": "Fur",
            "code": 1,
            "occurrences": "99.53",
            "count": 9932
        },
        {
            "trait_type": "Traits",
            "value": 5,
            "occurrences": "26.14",
            "count": 2609
        },
        {
            "trait_type": "Type",
            "value": "Ape",
            "occurrences": "99.40",
            "count": 9919
        },
        {
            "trait_type": "Best Trait Rarity",
            "value": "Common",
            "occurrences": "198.82",
            "count": 19840
        },
        {
            "trait_type": "Best Trait Rarity",
            "value": "Common",
            "occurrences": "198.82",
            "count": 19840
        },
        {
            "trait_type": "BAP ID",
            "value": 9000
        }
    ],
    "image": "https://imagedelivery.net/r12dBNi95K-w7NNZkxF9WQ/605b92c7-9b8e-483b-e49c-590988cac500/original",
    "free_spins": [
        {
            "type": "common",
            "used": true,
            "timestamp": 0,
            "txHash": "0xa2aca0898bd6f39ce535490811f552742921aa792a562a4f9cadb2d47cddbef7"
        }
    ],
    "token_id_original": 9000,
    "id": 9000,
    "type": "Ape",
    "CF_id": "605b92c7-9b8e-483b-e49c-590988cac500",
    "backup_image": "https://storage.googleapis.com/apes-test/apes/9000.png",
    "power": 100,
    "used_for_meth_bonus": false,
    "power_per_hour": 0.596,
    "rank": 5188,
    "score": 43.53394808381687,
    "multiplier": 1
}

const getData = () => {
    const updatedData = [];
    for (let i = 1; i < 100; i++) {
        updatedData.push({ ...dummyData, token_id: i, name: `Burned Ape #${i}`, id: i, token_id_original: i })
    }
    return updatedData
}

export default getData;