import React, { useEffect } from "react";
import { init, dispose } from "klinecharts";
import "./index.less";

const fruits = ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🍍", "🥥", "🥝", "🥭", "🥑", "🍏"];

function generatedKLineDataList(baseTimestamp = Date.now(), basePrice = 5000, dataSize = 800) {
	const dataList = [];
	let timestamp = Math.floor(baseTimestamp / 60 / 1000) * 60 * 1000;
	let baseValue = basePrice;
	const prices = [];
	for (let i = 0; i < dataSize; i++) {
		baseValue = baseValue + Math.random() * 20 - 10;
		for (let j = 0; j < 4; j++) {
			prices[j] = (Math.random() - 0.5) * 12 + baseValue;
		}
		prices.sort();
		const openIdx = +Math.round(Math.random() * 3).toFixed(0);
		let closeIdx = +Math.round(Math.random() * 2).toFixed(0);
		if (closeIdx === openIdx) {
			closeIdx++;
		}
		const volume = Math.random() * 50 + 10;
		const kLineModel = {
			open: prices[openIdx],
			low: prices[0],
			high: prices[3],
			close: prices[closeIdx],
			volume: volume,
			timestamp,
		};
		timestamp -= 60 * 1000;
		kLineModel.turnover = ((kLineModel.open + kLineModel.close + kLineModel.high + kLineModel.low) / 4) * volume;
		dataList.unshift(kLineModel);
	}
	return dataList;
}

// 自定义指标
const emojiTechnicalIndicator = {
	name: "EMOJI",
	plots: [{ key: "emoji" }],
	calcTechnicalIndicator: (kLineDataList) => {
		const result = [];
		kLineDataList.forEach((kLineData) => {
			result.push({ emoji: kLineData.close, text: fruits[Math.floor(Math.random() * 17)] });
		});
		return result;
	},
	render: (ctx, { from, to, kLineDataList, technicalIndicatorDataList }, { barSpace }, options, xAxis, yAxis) => {
		ctx.font = `${barSpace}px Helvetica Neue`;
		ctx.textAlign = "center";
		for (let i = from; i < to; i++) {
			const data = technicalIndicatorDataList[i];
			const x = xAxis.convertToPixel(i);
			const y = yAxis.convertToPixel(data.emoji);
			ctx.fillText(data.text, x, y);
		}
	},
};

const mainTechnicalIndicatorTypes = ["MA", "EMA", "SAR"];
const subTechnicalIndicatorTypes = ["VOL", "MACD", "KDJ"];

export default function TechnicalIndicatorKLineChart() {
	let kLineChart;
	let paneId;
	useEffect(() => {
		kLineChart = init("technical-indicator-k-line");
		// 将自定义技术指标添加到图表
		kLineChart.addCustomTechnicalIndicator(emojiTechnicalIndicator);
		paneId = kLineChart.createTechnicalIndicator("VOL", false);
		kLineChart.applyNewData(generatedKLineDataList(), false);
		return () => {
			dispose("technical-indicator-k-line");
		};
	}, []);
	return (
		<div className="k-line-chart-container">
			<div id="technical-indicator-k-line" className="k-line-chart" />
			<div className="k-line-chart-menu-container">
				<span style={{ paddingRight: 10 }}>主图指标</span>
				{mainTechnicalIndicatorTypes.map((type) => {
					return (
						<button
							key={type}
							onClick={(_) => {
								kLineChart.createTechnicalIndicator(type, false, { id: "candle_pane" });
							}}
						>
							{type}
						</button>
					);
				})}
				<button
					onClick={(_) => {
						kLineChart.createTechnicalIndicator("EMOJI", true, { id: "candle_pane" });
					}}
				>
					自定义
				</button>
				<span style={{ paddingRight: 10, paddingLeft: 12 }}>副图指标</span>
				{subTechnicalIndicatorTypes.map((type) => {
					return (
						<button
							key={type}
							onClick={(_) => {
								kLineChart.createTechnicalIndicator(type, false, { id: paneId });
							}}
						>
							{type}
						</button>
					);
				})}
				<button
					onClick={(_) => {
						kLineChart.createTechnicalIndicator("EMOJI", false, { id: paneId });
					}}
				>
					自定义
				</button>
			</div>
		</div>
	);
}
