import React, { useEffect, useState } from 'react';
import { getNumberActiveMembers } from './analytics_service';

export const ActiveMembers: React.FC = () => {
    const [totalMembers, setTotalMembers] = useState<number>(-1);

    useEffect(() => {
        const fetchData = async () => {
            const totalMembers: any = await getNumberActiveMembers();
            setTotalMembers(totalMembers as number);
        };

        fetchData();
    }, []);

    return (
        <div>
        { (totalMembers >= 0) && 
            <div>
                The Total Number of Members is: {totalMembers}
            </div>
        }
        </div>
    );
};

export default ActiveMembers;