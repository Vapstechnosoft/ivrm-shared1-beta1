interface HeadingProps {
    title: string;
    description?: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
    return (
        <div className='pl-4'>
            <h4>{title}</h4>
            {description && <p className='text-muted-foreground text-sm'>{description}</p>}
        </div>
    );
};
