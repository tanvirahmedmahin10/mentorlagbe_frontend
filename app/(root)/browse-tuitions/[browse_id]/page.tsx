import { TuitionPostPayload } from '@/lib/postApiBackend/postData';
import React from 'react';
export interface IParams {
  params: Promise<{
    browse_id: string;
  }>;
}


const DetailsPage = async({ params }: IParams) => {
      const { browse_id } = await params;

  const CourseDetails: TuitionPostPayload | null = null;
    return (
        <div>
            
        </div>
    );
};

export default DetailsPage;