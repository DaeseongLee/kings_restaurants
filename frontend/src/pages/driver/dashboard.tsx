import { gql, useMutation, useSubscription } from '@apollo/client';
import React from 'react';
import { useHistory } from 'react-router';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { cookedOrders } from '../../__generated__/cookedOrders';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';

const COOKED_ORDERS_SUBSCRIPTION = gql`
    subscription cookedOrders {
        cookedOrders {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
    mutation takeOrder($input: TakeOrderInput!) {
        takeOrder(input: $input) {
            ok
            error
        }
    }
`;



const Dashboard = () => {
    const { data: cookedOrdersData } = useSubscription<cookedOrders>(COOKED_ORDERS_SUBSCRIPTION);
    const history = useHistory();
    const onCompleted = (data: takeOrder) => {
        if (data.takeOrder.ok) {
            history.push(`/order/${cookedOrdersData?.cookedOrders.id}`);
        }
    };
    const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(TAKE_ORDER_MUTATION, {
        onCompleted
    });
    const triggerMutation = (orderId: number) => {
        takeOrderMutation({
            variables: {
                input: {
                    id: orderId,
                },
            },
        });
    };
    console.log('cookedOrdersData!!!', cookedOrdersData);
    return (
        <div>
            <div className=" max-w-screen-sm mx-auto mt-44 bg-white relative -top-10 shadow-lg py-8 px-5">
                {cookedOrdersData?.cookedOrders.restaurant ? (
                    <>
                        <h1 className="text-center  text-3xl font-medium">
                            New Coocked Order
                        </h1>
                        <h1 className="text-center my-3 text-2xl font-medium">
                            Pick it up soon @{" "}
                            {cookedOrdersData?.cookedOrders.restaurant?.name}
                        </h1>
                        <button
                            onClick={() =>
                                triggerMutation(cookedOrdersData?.cookedOrders.id)
                            }>
                            Accept Challenge &rarr;
                        </button>
                    </>
                ) : (
                    <h1 className="text-center  text-3xl font-medium">
                        No orders yet...
                    </h1>
                )}
            </div>
        </div>
    );
};

export default Dashboard;