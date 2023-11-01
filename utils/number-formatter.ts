const numberFormatter = new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 1,
});

export const formatNumber = (number: number) => numberFormatter.format(number);
