interface Props {
  title: string;
  amount: bigint;
}

export function Balance({ title, amount }: Props) {
  return (
    <div className="w-full text-center mb-8">
      <h4>{title}</h4>
      <div className="mt-4">
        <span className="text-4xl font-bold mr-1">
          {amount?.toLocaleString()}
        </span>
        <span>円</span>
      </div>
    </div>
  );
}
