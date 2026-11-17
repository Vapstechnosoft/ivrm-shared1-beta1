import COEClient from './_components/coe-client';
import { getCOELoadData } from './actions';

export default async function COEPage() {
    const loanData = await getCOELoadData();

    return (
        <div className='w-full'>
            <COEClient initialData={loanData} />
        </div>
    );
}
