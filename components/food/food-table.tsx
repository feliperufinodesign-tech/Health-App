import type { Food } from "@/lib/types";

export function FoodTable({ foods }: { foods: Food[] }) {
  if (foods.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum alimento cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-2 pr-2">Nome</th>
            <th className="py-2 pr-2">Base</th>
            <th className="py-2 pr-2">Kcal</th>
            <th className="py-2 pr-2">Prot</th>
            <th className="py-2 pr-2">Carbo</th>
            <th className="py-2 pr-2">Gord</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.id} className="border-b last:border-0">
              <td className="py-2 pr-2">{food.nome}</td>
              <td className="py-2 pr-2">
                {food.base_qtd}
                {food.unidade}
              </td>
              <td className="py-2 pr-2">{food.kcal}</td>
              <td className="py-2 pr-2">{food.proteina_g}g</td>
              <td className="py-2 pr-2">{food.carbo_g}g</td>
              <td className="py-2 pr-2">{food.gordura_g}g</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
